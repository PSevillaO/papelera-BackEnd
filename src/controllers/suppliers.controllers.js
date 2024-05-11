const Suppliers = require('../models/suppliers.models');

async function getSuppliers(req, res) {
    try {
        const id = req.params.id;

        if (id) {
            const suppliers = await Suppliers.findById(id)
            if (!suppliers) {
                return res.status(404).send({
                    ok: false,
                    message: "No se encontro el proveedor"
                })
            }
            return res.send({
                ok: true,
                suppliers,
                messege: "Proveedor Encontrado"
            })
        }
        // aca controlo la cantidad de registros que devuelvo
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;

        const suppliers = await Suppliers.find()
            .limit(limit)
            .skip(page * limit)
            .collation({ locale: 'es' })
            .sort({ title: 1 })

        const total = await Suppliers.countDocuments();


        if (!suppliers.length) {
            return res.status(404).send({
                ok: false,
                messege: "Proveedores No Encontrados"
            })
        }

        res.send({
            ok: true,
            suppliers,
            message: "Proveedor Encontrados",
            total
        })


    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener el Proveedor"
        })
    }
}

async function createSuppliers(req, res) {
    try {
        const suppliers = new Suppliers(req.body)
        const SuppliersSave = await suppliers.save();

        res.status(201).send({
            ok: true,
            message: "Proveedor Creado correctamente",
            suppliers: SuppliersSave
        });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo crear el Proveedor",
            error: error
        });
    }
}

async function deleteSuppliers(req, res) {
    try {
        // comprobar que la persona que desea borrar es un admin

        // if (req.user.role !== 'ADMIN_ROLE') {
        // return res.status(401).send({
        // ok: false,
        // message: "No tienes permisos para realizar esta acción"
        // })
        // }
        const id = req.params.id
        console.log(id)

        const suppliersDeleted = await Suppliers.findByIdAndDelete(id)

        if (!suppliersDeleted) {
            return res.status(404).send({
                ok: false,
                messege: "No se encontro el Proveedor"
            })
        }
        res.send({
            ok: true,
            message: "Proveedor Borrado Correctamente",
            suppliers: suppliersDeleted
        });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo borrar el Proveedor",
            error: error
        });
    }
}

async function updateSuppliers(req, res) {
    try {

        // if (req.user.role !== 'ADMIN_ROLE') {
        //     return res.status(403).send({
        //         ok: false,
        //         message: "No tienes permisos para realizar esta acción"
        //     })
        // }

        const id = req.params.id;
        const nuevosValores = req.body;

        const suppliersUpdater = await Suppliers.findByIdAndUpdate(id, nuevosValores, { new: true })

        res.send({
            ok: true,
            message: "Proveedor fue actualizado Correctamente",
            suppliers: suppliersUpdater
        });

    } catch (error) {
        res.send({
            ok: false,
            message: "El Proveedor no se pudo actualizar",
            error: error
        })
    }
}

async function searchSuppliers(req, res) {
    try {
        const searchTerm = req.params.search;
        if (!searchTerm) {
            return res.status(400).send({
                ok: false,
                message: "Se requiere un término de búsqueda"
            });
        }

        const regex = new RegExp(searchTerm, 'i');

        const suppliers = await Suppliers.find({
            $or: [
                { nombre: regex },
                { direccion: regex }
            ]
        });

        if (!suppliers.length) {
            return res.send({
                ok: true,
                message: "No se encontraron Proveedores que coincidan con la búsqueda",
                suppliers: []
            });
        }

        return res.send({
            ok: true,
            message: "Proveedores encontrados",
            suppliers
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            ok: false,
            message: "No se pudo realizar la búsqueda de Proveedores"
        });
    }
}


module.exports = {
    getSuppliers,
    createSuppliers,
    deleteSuppliers,
    updateSuppliers,
    searchSuppliers,
}

