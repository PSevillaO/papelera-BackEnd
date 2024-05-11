const Product = require('../models/product.models');
const Supplier = require('../models/suppliers.models');

async function getProduct(req, res) {
    try {
        const id = req.params.id;

        if (id) {
            const product = await Product.findById(id).populate("category").populate({
                path: 'suppliers',
                model: 'Suppliers'
            })
            if (!product) {
                return res.status(404).send({
                    ok: false,
                    message: "No se encontro el producto"
                })
            }
            return res.send({
                ok: true,
                product,
                messege: "Producto Encontrado"
            })
        }
        // aca controlo la cantidad de registros que devuelvo
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;

        const products = await Product.find()
            .populate("category")
            .populate({
                path: 'suppliers',
                model: 'Suppliers'
            })
            .limit(limit)
            .skip(page * limit)
            .collation({ locale: 'es' })
        // .sort({ title: 1 })

        const total = await Product.countDocuments();


        if (!products.length) {
            return res.status(404).send({
                ok: false,
                messege: "Productos No Encontrados"
            })
        }

        res.send({
            ok: true,
            products,
            message: "Productos Encontrados",
            total
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener el Producto"
        })
    }
}

// async function createProduct(req, res) {
//     try {
//         const product = new Product(req.body)
//         console.log(product)

//         // con esto cargo el nombre de la imagen en el usuario
//         if (req.file?.filename) {
//             product.image = req.file.filename;
//         }
//         const prodcutSave = await product.save();
//         res.status(201).send({
//             ok: true,
//             message: "Producto Creado correctamente",
//             product: prodcutSave
//         });
//     } catch (error) {
//         console.error(error)
//         res.status(500).send({
//             ok: false,
//             message: "No se pudo crear el producto"
//         });
//     }
// }

async function createProduct(req, res) {
    try {
        const { articulo, descripcion, detalle, presentacion, unidad, precio, category, stock, suppliers } = req.body;

        // Convertir los IDs de los proveedores en objetos
        const supplierObjects = await Promise.all(suppliers.map(async supplierId => {
            const supplier = await Supplier.findById(supplierId);
            return supplier;
        }));

        const product = new Product({
            articulo,
            descripcion,
            detalle,
            presentacion,
            unidad,
            precio,
            category,
            stock,
            suppliers: supplierObjects // Aquí se asignan los objetos de proveedores convertidos
        });

        await product.save();

        res.status(201).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}
async function deleteProduct(req, res) {
    try {
        // comprobar que la persona que desea borrar es un admin

        // if (req.user.role !== 'ADMIN_ROLE') {
        //     return res.status(401).send({
        //         ok: false,
        //         message: "No tienes permisos para realizar esta acción"
        //     })
        // }
        const id = req.params.id

        const productDeleted = await Product.findByIdAndDelete(id)

        if (!productDeleted) {
            return res.status(404).send({
                ok: false,
                messege: "No se encontro el Producto"
            })
        }
        res.send({
            ok: true,
            message: "Producto Borrado Correctamente",
            product: productDeleted
        });
    } catch (error) {
        res.status(500).send({
            ok: false,
            message: "No se pudo borrar el producto",
            error: error
        });
    }
}
async function updateProduct(req, res) {
    try {

        const id = req.params.id;
        const nuevosValores = req.body;

        if (req.file?.filename) {
            nuevosValores.image = req.file.filename;
        }

        const productUpdater = await Product.findByIdAndUpdate(id, nuevosValores, { new: true })

        res.send({
            ok: true,
            message: "Producto fue actualizado Correctamente",
            product: productUpdater
        });

    } catch (error) {
        res.send({
            ok: false,
            message: "El producto no se pudo actualizar",
            error: error
        })
    }
}



async function searchProducts(req, res) {
    try {
        const searchTerm = req.params.search;
        if (!searchTerm) {
            return res.status(400).send({
                ok: false,
                message: "Se requiere un término de búsqueda"
            });
        }

        const regex = new RegExp(searchTerm, 'i');

        const product = await Product.find({
            $or: [
                { articulo: regex },
                { descripcion: regex }
            ]
        }).populate("category")
            .populate({
                path: 'suppliers',
                model: 'Suppliers'
            });

        if (!product.length) {
            return res.send({
                ok: true,
                message: "No se encontraron productos que coincidan con la búsqueda",
                product: []
            });
        }

        return res.send({
            ok: true,
            message: "Productos encontrados",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            ok: false,
            message: "No se pudo realizar la búsqueda de productos"
        });
    }
}


module.exports = {
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    searchProducts,
}

