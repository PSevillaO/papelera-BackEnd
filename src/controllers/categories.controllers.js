// const { request } = require("../app");
const Category = require("../models/category.models")
const { MongoServerError } = require('mongodb');

async function getCategories(req, res) {
    try {
        let rootCategory = null;

        // Verificar si se proporcionó una categoría raíz en la solicitud
        if (req.query.rootCategory) {
            rootCategory = await Category.findById(req.query.rootCategory);
            if (!rootCategory) {
                return res.status(404).send({
                    ok: false,
                    message: "Categoría raíz no encontrada"
                });
            }
        }

        // Función recursiva para encontrar todas las subcategorías de una categoría dada
        async function findSubcategories(category) {
            const subcategories = await Category.find({ parent: category._id });
            const subcategoriesWithChildren = await Promise.all(subcategories.map(async (subcategory) => {
                const children = await findSubcategories(subcategory);
                return {
                    ...subcategory.toObject(),
                    children
                };
            }));
            return subcategoriesWithChildren;
        }

        // Obtener todas las categorías, comenzando desde la raíz si se proporciona
        const categories = rootCategory ? await findSubcategories(rootCategory) : await findSubcategories({});

        res.send({
            ok: true,
            categories,
            message: "Categorías encontradas"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error del servidor"
        });
    }
}
async function createCategory(req, res) {
    try {
        const { nombre, descripcion, parent } = req.body;
        let categoryDB;

        if (parent) {
            // Verificar si la categoría principal existe
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                return res.status(404).send({
                    ok: false,
                    message: "Categoría principal no encontrada"
                });
            }

            // Crear la categoría con la categoría principal asignada
            categoryDB = await Category.create({
                nombre,
                descripcion,
                parent: parentCategory._id // Asignar el ID de la categoría principal como el padre
            });
        } else {
            // Si no se proporciona una categoría principal, crear la categoría sin padre
            categoryDB = await Category.create({
                nombre,
                descripcion
            });
        }

        res.status(201).send({
            ok: true,
            category: categoryDB,
            message: "Categoría creada"
        });

    } catch (error) {
        console.error(error);
        if (error instanceof MongoServerError && error.code === 11000) {
            // Si el error es debido a una clave duplicada (código 11000),
            // enviar un mensaje personalizado al frontend
            res.status(409).send({
                ok: false,
                message: "Ya existe una categoría con este nombre"
            });
        } else {
            // En caso de otro error, enviar un mensaje genérico al frontend
            res.status(500).send({
                ok: false,
                message: "No se pudo crear la categoría"
            });
        }
    }
}

async function updateCategory(req, res) {
    try {

        // if (req.user.role !== 'ADMIN_ROLE') {
        //     return res.status(403).send({
        //         ok: false,
        //         message: "No tienes permisos para realizar esta acción"
        //     })
        // }

        const id = req.params.id;
        const nuevosValores = req.body;

        const CategoryUpdater = await Category.findByIdAndUpdate(id, nuevosValores, { new: true })

        res.send({
            ok: true,
            message: " La Categoria fue actualizado Correctamente",
            category: CategoryUpdater
        });

    } catch (error) {
        res.send({
            ok: false,
            message: "El Categoria no se pudo actualizar",
            error: error
        })
    }
}

async function deleteCategory(req, res) {
    try {
        const categoryId = req.params.id;

        // Buscar la categoría por su ID
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).send({
                ok: false,
                message: "Categoría no encontrada"
            });
        }

        // Eliminar la categoría y sus categorías hijas recursivamente
        await deleteCategoryAndChildren(category);

        res.status(200).send({
            ok: true,
            message: "Categoría y sus categorías hijas eliminadas correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al eliminar la categoría y sus categorías hijas"
        });
    }
}

async function deleteCategoryAndChildren(category) {
    // Eliminar la categoría actual
    await Category.findByIdAndDelete(category._id);

    // Obtener las categorías hijas
    const childCategories = await Category.find({ parent: category._id });

    // Eliminar recursivamente las categorías hijas
    for (const childCategory of childCategories) {
        await deleteCategoryAndChildren(childCategory);
    }
}

async function searchCategory(req, res) {
    try {
        const searchTerm = req.params.search;
        if (!searchTerm) {
            return res.status(400).send({
                ok: false,
                message: "Se requiere un término de búsqueda"
            });
        }

        const regex = new RegExp(searchTerm, 'i');

        const category = await Category.find({
            $or: [
                { nombre: regex },
                { descripcion: regex }
            ]
        });

        if (!category.length) {
            return res.send({
                ok: true,
                message: "No se encontraron las categorias",
                category: []
            });
        }

        return res.send({
            ok: true,
            message: "Categorias encontradas",
            category
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            ok: false,
            message: "No se pudo realizar la búsqueda de categias"
        });
    }
}





module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategory
}