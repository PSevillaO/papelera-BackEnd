const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret = 'PalabraSecreta123'

async function getUsers(req, res) {
    try {
        const id = req.params.id;

        if (id) {
            const users = await User.findById(id, { password: 0 })
            if (!users) {
                return res.status(404).send({
                    ok: false,
                    message: "No se encontro el usuario"
                })
            }
            return res.send({
                ok: true,
                users,
                messege: "Usuario Encontrado"
            })
        }
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;

        // Promise all ejecuta dos o mas await a la ves
        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find()
                .limit(limit)
                .skip(page * limit)
                .collation({ locale: 'es' })
                .sort({ name: 1 })
                .select({ password: 0, __v: 0 })
        ])


        if (!users.length) {
            return res.status(404).send({
                ok: false,
                messege: "Usuarios No Encontrados"
            })
        }

        res.send({
            ok: true,
            users,
            message: "Usuarios Encontrados",
            total
        })


    } catch (error) {
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener el usuario"
        })
    }

    // res.send('GET Nuevo usuario');
}

async function createUser(req, res) {
    try {
        const users = new User(req.body)

        // con esto cargo el nombre de la imagen en el usuario
        if (req.file?.filename) {
            users.image = req.file.filename;
        }

        console.log(saltRounds)
        // encriptar contraseña
        users.password = await bcrypt.hash(users.password, saltRounds)
        console.log(users.password)

        const userSave = await users.save();
        userSave.password = "********"

        res.status(201).send({
            ok: true,
            message: "Usuario Creado correctamente",
            users: userSave
        });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo crear el usuario",
            error: error
        });
    }
}

async function deleteUser(req, res) {
    try {
        // comprobar que la persona que desea borrar es un admin

        // if (req.users.role !== 'ADMIN_ROLE') {
        //     return res.status(403).send({
        //         ok: false,
        //         message: "No tienes permisos para realizar esta acción"
        //     })
        // }

        const id = req.params.idUser

        const userDeleted = await User.findByIdAndDelete(id)

        if (!userDeleted) {
            return res.status(404).send({
                ok: false,
                messege: "No se encontro el Usuario"
            })
        }
        res.send({
            ok: true,
            message: "Usuario Borrado Correctamente",
            users: userDeleted
        });
    } catch (error) {
        res.send(error);
    }
}

async function updateUser(req, res) {
    try {
        // if (req.user.role !== 'ADMIN_ROLE') {
        //     return res.status(403).send({
        //         ok: false,
        //         message: "No tienes permisos para realizar esta acción No es Admin"
        //     })
        // }

        const id = req.params.idUser;
        const nuevosValores = req.body;

        if (req.file?.filename) {
            nuevosValores.image = req.file.filename;
        }
        const userUpdater = await User.findByIdAndUpdate(id, nuevosValores, { new: true })

        res.send({
            ok: true,
            message: "Usuario fue actualizado Correctamente",
            users: userUpdater
        });

    } catch (error) {
        res.send({
            ok: false,
            message: "El usuario no se pudo actualizar"
        })
    }
}

async function updatePass(req, res) {
    try {
        const id = req.params.idUser;
        const { oldPassword, newPassword } = req.body;

        // Obtener el usuario de la base de datos
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ ok: false, message: "Usuario no encontrado" });
        }
        // Verificar si la contraseña actual es correcta
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ ok: false, message: "La contraseña actual es incorrecta" });
        }
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        // Actualizar la contraseña en la base de datos
        const userUpdater = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        res.status(201).send({
            ok: true,
            message: "Clave cambiada correctamente",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al cambiar la contraseña del usuario"
        });
    }
}


async function login(req, res) {
    try {

        //obtenemos del Body el email y el password
        const { password, email } = req.body;

        if (!password || !email) {
            return res.status(400).send({
                ok: false,
                message: "Faltan Datos"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return res.status(404).send({
                ok: false,
                message: "Datos Incorrectos"
            });
        }
        // Si existe el usuario verificar la contraseña
        const verifyUser = await bcrypt.compare(password, user?.password)

        // si el usuario no existe o la contraseña no es correcta 
        if (!verifyUser) {
            return res.status(404).send({
                ok: false,
                message: "Datos Incorrectos"
            });
        }

        user.password = undefined;

        // generar un token 
        const token = jwt.sign({ user }, secret, { expiresIn: '8h' })


        res.send({
            ok: true,
            message: "Login Correcto",
            user,
            token
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo hacer el Login"
        })
    }
}

async function searchUsers(req, res) {
    try {
        const searchTerm = req.params.search;
        if (!searchTerm) {
            return res.status(400).send({
                ok: false,
                message: "Se requiere un término de búsqueda"
            });
        }

        const regex = new RegExp(searchTerm, 'i');

        const users = await User.find({
            $or: [
                { nombre: regex },
                { email: regex }
            ]
        });

        if (!users.length) {
            return res.send({
                ok: true,
                message: "No se encontraron usuarios que coincidan con la búsqueda",
                users: []
            });
        }

        return res.send({
            ok: true,
            message: "Usuarios encontrados",
            users
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            ok: false,
            message: "No se pudo realizar la búsqueda de usuarios"
        });
    }
}

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    login,
    searchUsers,
    updatePass
}