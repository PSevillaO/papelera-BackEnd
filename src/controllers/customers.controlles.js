const Customers = require('../models/customers.models');

async function getCustomers(req, res) {
    try {
        const id = req.params.id;

        if (id) {
            const customers = await Customers.findById(id)
            if (!customers) {
                return res.status(404).send({
                    ok: false,
                    message: "No se encontro el Cliente"
                })
            }
            return res.send({
                ok: true,
                product,
                messege: "Cliente Encontrado"
            })
        }
        // aca controlo la cantidad de registros que devuelvo
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;

        const customers = await Customers.find()
            .limit(limit)
            .skip(page * limit)
            .collation({ locale: 'es' })
            .sort({ title: 1 })

        const total = await Customers.countDocuments();


        if (!customers.length) {
            return res.status(404).send({
                ok: false,
                messege: "Clientes No Encontrados"
            })
        }

        res.send({
            ok: true,
            customers,
            message: "clientes Encontrados",
            total
        })


    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener el Cliente"
        })
    }
}

async function createCustomers(req, res) {
    try {
        const customers = new Customers(req.body)
        const customersSave = await customers.save();

        res.status(201).send({
            ok: true,
            message: "Cliente Creado correctamente",
            customers: customersSave
        });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo crear el Cliente",
            error: error
        });
    }
}

async function deleteCustomers(req, res) {
    try {
        // comprobar que la persona que desea borrar es un admin

        // if (req.user.role !== 'ADMIN_ROLE') {
        // return res.status(401).send({
        // ok: false,
        // message: "No tienes permisos para realizar esta acción"
        // })
        // }
        const id = req.params.id

        const customersDeleted = await Customers.findByIdAndDelete(id)

        if (!customersDeleted) {
            return res.status(404).send({
                ok: false,
                messege: "No se encontro el Cliente"
            })
        }
        res.send({
            ok: true,
            message: "Cliente Borrado Correctamente",
            customers: customersDeleted
        });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo borrar el Cliente",
            error: error
        });
    }
}

async function updateCustomers(req, res) {
    try {

        // if (req.user.role !== 'ADMIN_ROLE') {
        //     return res.status(403).send({
        //         ok: false,
        //         message: "No tienes permisos para realizar esta acción"
        //     })
        // }

        const id = req.params.id;
        const nuevosValores = req.body;

        const customersUpdater = await Customers.findByIdAndUpdate(id, nuevosValores, { new: true })

        res.send({
            ok: true,
            message: "Cliente fue actualizado Correctamente",
            customers: customersUpdater
        });

    } catch (error) {
        res.send({
            ok: false,
            message: "El Cliente no se pudo actualizar",
            error: error
        })
    }
}

async function searchCustomers(req, res) {
    try {
        const searchTerm = req.params.search;
        if (!searchTerm) {
            return res.status(400).send({
                ok: false,
                message: "Se requiere un término de búsqueda"
            });
        }

        const regex = new RegExp(searchTerm, 'i');

        const customers = await Customers.find({
            $or: [
                { nombre: regex },
                { direccion: regex }
            ]
        });

        if (!customers.length) {
            return res.send({
                ok: true,
                message: "No se encontraron Clientes que coincidan con la búsqueda",
                customers: []
            });
        }

        return res.send({
            ok: true,
            message: "Clientes encontrados",
            customers
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            ok: false,
            message: "No se pudo realizar la búsqueda de Clientes"
        });
    }
}


module.exports = {
    getCustomers,
    createCustomers,
    deleteCustomers,
    updateCustomers,
    searchCustomers,
}

