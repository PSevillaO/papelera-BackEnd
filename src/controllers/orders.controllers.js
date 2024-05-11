const Order = require('../models/orders.models');
// const Customers = require('../models/customers.models');
const Product = require('../models/product.models')
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { format } = require('date-fns');

// Controlador para agregar una nueva orden
const createOrder = async (req, res) => {
    try {
        const { pedidoData } = req.body;
        const { products, customer, deliveryDate, orden } = pedidoData;
        const newOrder = new Order({
            products,
            customer,
            deliveryDate,
            orden
            // Puedes agregar más campos según sea necesario
        });
        const orderSave = await newOrder.save();
        res.status(201).send({
            ok: true,
            message: "Orden Creada",
            order: orderSave
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo crear la orden",
            error: error
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la solicitud
        const { pedidoData } = req.body; // Obtener los datos de la orden de la solicitud
        const { products, customer, deliveryDate, status } = pedidoData;
        // Buscar y actualizar la orden con el ID proporcionado
        const updatedOrder = await Order.findByIdAndUpdate(id, {
            products,
            customer,
            deliveryDate,
            status
            // Puedes agregar más campos según sea necesario para actualizar
        }, { new: true }); // { new: true } devuelve el documento actualizado

        if (!updatedOrder) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Orden actualizada",
            order: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo actualizar la orden",
            error: error
        });
    }
};

async function updateOrderStatus(req, res) {
    try {

        // if (req.user.role !== 'ADMIN_ROLE') {
        //     return res.status(403).send({
        //         ok: false,
        //         message: "No tienes permisos para realizar esta acción"
        //     })
        // }
        const id = req.params.id;
        const nuevosValores = req.body;
        const ordersUpdater = await Order.findByIdAndUpdate(id, nuevosValores, { new: true })
        res.send({
            ok: true,
            message: "La orden fue actualizada Correctamente",
            order: ordersUpdater
        });

    } catch (error) {
        res.send({
            ok: false,
            message: "La orden no se pudo actualizar",
            error: error
        })
    }
}

// Controlador para obtener todas las órdenes
const getOrders = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {

            const limit = parseInt(req.query.limit) || 1000;
            let query = Order.find();
            query = query.where('customer').equals(id);
            const orders = await query
                .populate({
                    path: 'products',
                    populate: {
                        path: 'product', // Poblar los datos del producto
                        model: 'Product', // Modelo de producto
                        populate: {
                            path: 'category', // Poblar la categoría del producto
                            model: 'Category', // Modelo de categoría
                        },
                    },
                })
                .populate('customer')
                .collation({ locale: 'es' })
                .limit(limit)
                .sort({ deliveryDate: -1 })


            if (!orders.length) {
                return res.status(404).send({
                    ok: false,
                    message: "ordenes No Encontradas"
                })
            }
            const total = await Order.countDocuments();
            res.send({
                ok: true,
                orders,
                message: "Ordenes Encontradas",
                total
            })
        } else {
            const orders = await Order.find()
                .populate({
                    path: 'products',
                    populate: {
                        path: 'product', // Poblar los datos del producto
                        model: 'Product', // Modelo de producto
                        populate: {
                            path: 'category', // Poblar la categoría del producto
                            model: 'Category', // Modelo de categoría
                        },
                    },
                })
                .populate('customer')
                .collation({ locale: 'es' });
            if (!orders.length) {
                return res.status(404).send({
                    ok: false,
                    message: "ordenes No Encontradas"
                })
            }
            const total = await Order.countDocuments();
            res.send({
                ok: true,
                orders,
                message: "Ordenes Encontradas",
                total
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener la orden"
        })
    }
};


const getOrdersDate = async (req, res) => {
    try {
        // Obtener la fecha de entrega del parámetro de la solicitud
        const { date } = req.params;

        // Validar que se haya proporcionado una fecha de entrega
        if (!date) {
            return res.status(400).send({
                ok: false,
                message: "La fecha de entrega es obligatoria."
            });
        }

        // Convertir la fecha de entrega a un objeto Date
        const deliveryDate = new Date(date);

        // Buscar órdenes por fecha de entrega y poblado de datos relacionados
        const orders = await Order.find({ deliveryDate })
            .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    model: 'Product'
                }
            })
            .populate('customer')
            .collation({ locale: 'es' })
            .sort({ orden: 1 });

        // Devolver las órdenes encontradas
        res.send({
            ok: true,
            orders,
            message: "Órdenes encontradas para la fecha de entrega proporcionada."
        });
    } catch (error) {
        console.error('Error al buscar órdenes por fecha de entrega:', error);
        res.status(500).send({
            ok: false,
            message: "Ocurrió un error al buscar órdenes por fecha de entrega."
        });
    }

};

const getLatestOrderNumber = async (req, res) => {
    try {
        const { date } = req.params;
        if (!date) {
            return res.status(400).send({
                ok: false,
                message: "La fecha de entrega es obligatoria."
            });
        }

        const deliveryDate = new Date(date);

        const latestOrder = await Order.findOne({ deliveryDate })
            .sort({ orden: -1 }) // Orden descendente para obtener el último
            .select('orden');

        // Si no hay órdenes para esa fecha, comenzar desde 1
        const latestOrderNumber = latestOrder ? latestOrder.orden + 1 : 1;

        res.send({
            ok: true,
            latestOrderNumber
        });
    } catch (error) {
        console.error('Error al obtener el último orden:', error);
        res.status(500).send({
            ok: false,
            message: "Ocurrió un error al obtener el último orden."
        });
    }
};


const updateProductStockInOrder = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la orden de los parámetros de la solicitud
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        // Recorre todos los productos de la orden y actualiza su stock
        for (const productInOrder of order.products) {
            const productId = productInOrder.product._id;

            // Obtener el stock actual del producto
            const product = await Product.findById(productId);
            let stock = product.stock || 0; // Si el stock está vacío, se establece como 0

            // Resta la cantidad del producto del stock
            let newStock = stock - productInOrder.quantity;

            // Verifica que el stock no sea menor que cero
            if (newStock < 0) {
                newStock = 0; // Si es menor que cero, establece el stock en cero
            }

            // Actualiza el stock del producto en la base de datos
            product.stock = newStock;
            await product.save();

            // Actualiza el stock del producto en la orden
            productInOrder.stock = newStock;
        }

        // Guarda la orden actualizada
        await order.save();

        res.status(200).send({
            ok: true,
            message: "Stock de productos de la orden actualizado correctamente",
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al actualizar el stock de productos de la orden",
            error: error.message // Devuelve el mensaje de error para identificar la causa exacta
        });
    }
};

const updateProductStock = async (productId, newStock) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error("Producto no encontrado");
        }

        // Actualiza el stock del producto
        product.stock = newStock;

        // Guarda el producto actualizado
        await product.save();
    } catch (error) {
        throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
    }
};

// Aca genero la estructura del archivo excel 
async function generateExcel(orderData) {
    const workbook = new ExcelJS.Workbook();

    if (orderData && Array.isArray(orderData)) {
        orderData.forEach(order => {
            const worksheet = workbook.addWorksheet('Orden');

            // Estilos para los encabezados
            const headerStyle = {
                font: { bold: true },
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            };

            worksheet.addRow(['Cliente', order.customer]).eachCell(cell => cell.style = headerStyle);
            worksheet.addRow(['Fecha de entrega', order.deliveryDate]).eachCell(cell => cell.style = headerStyle);
            worksheet.addRow(['Total de cantidad', order.totalQuantity]).eachCell(cell => cell.style = headerStyle);
            worksheet.addRow(['Precio total', order.totalPrice]).eachCell(cell => cell.style = headerStyle);
            worksheet.addRow([]); // Agregar fila en blanco

            // Encabezados de productos con estilo
            worksheet.addRow(['Artículo', 'Descripción', 'Cantidad', 'Precio']).eachCell(cell => cell.style = headerStyle);

            if (order.products && Array.isArray(order.products)) {
                order.products.forEach(product => {
                    worksheet.addRow([
                        product.articulo,
                        product.descripcion,
                        // product.stock,
                        product.cantidad,
                        product.precio
                    ]);
                });
            }
            // Aplicar estilo a las celdas de fecha
            worksheet.getColumn(2).eachCell((cell, rowNumber) => {
                if (rowNumber > 1) {
                    cell.numFmt = 'dd/MM/yyyy';
                }
            });
            // Aplicar estilos a las celdas de datos
            const dataStyle = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            };

            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell, colNumber) => {
                    if (rowNumber > 6) { // Ignorar las primeras filas de encabezados
                        cell.style = dataStyle;
                    }
                });
            });
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

// Esta funcion genera el excel de cada card
const getOrdersExcel = async (req, res) => {
    try {
        const id = req.params.id;
        const { totalQuantity, totalPrice } = req.query; // Obtener los parámetros del query string

        const order = await Order.findById(id)
            .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    model: 'Product',
                },
            })
            .populate('customer');

        if (!order) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        // Genera el archivo Excel con los datos de la orden
        const orderData = {
            customer: order.customer.nombre,
            deliveryDate: order.deliveryDate,
            products: order.products.map(product => ({
                articulo: product.product.articulo,
                descripcion: product.product.descripcion,
                stock: product.stock,
                cantidad: product.quantity,
                precio: product.price,
            })),
            totalQuantity: totalQuantity, // Utilizamos los parámetros del query string
            totalPrice: totalPrice,
        };

        // Llama a la función generateExcel y espera a que se resuelva la promesa
        const excelBuffer = await generateExcel([orderData]);

        // Envía el archivo Excel como respuesta
        res.setHeader('Content-Disposition', 'attachment; filename=orden.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener la orden"
        });
    }
};


// esta funcion genera el excel para todas las ordenes del dia, recibe un array con las ordenes y genera el excel
const getExcelbyDay = async (req, res) => {
    try {
        const { pedidoData } = req.body;

        const buffer = await generateExcelbyDay(pedidoData);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener la orden"
        });
    }
}

// aca imprimo todas las ordenes del dia
const generateExcelbyDay = async (orderData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ordenes');

    // Estilos para los encabezados
    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } }, // Blanco
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF808080' } // Gris
        }
    };
    const footerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } }, // Blanco
        alignment: { vertical: 'middle', horizontal: 'rigth' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF808080' } // Gris
        }
    };



    // Estilo para las fechas
    const dateStyle = {
        numFmt: 'dd/mm/yyyy'
    };

    if (orderData && Array.isArray(orderData)) {
        orderData.forEach(order => {
            const formattedDeliveryDate = new Date(order.deliveryDate).toLocaleDateString('es-ES'); // Formatea la fecha

            worksheet.addRow(['Cliente: ' + order.customer.nombre, 'Fecha de entrega: ', "", formattedDeliveryDate]).eachCell(cell => {
                cell.style = headerStyle;
            });
            worksheet.addRow(['Artículo', 'Descripción', 'Cantidad', 'Precio']).eachCell(cell => cell.style = headerStyle);

            if (order.products && Array.isArray(order.products)) {
                order.products.forEach(product => {
                    worksheet.addRow([
                        product.product.articulo,
                        product.product.descripcion,
                        product.quantity,
                        product.product.precio
                    ]);
                });
            }
            worksheet.addRow(['Precio total: ', "", order.totalQuantity, order.totalPrice]).eachCell(cell => cell.style = footerStyle);
            worksheet.addRow([]);
            worksheet.addRow([]);
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};


module.exports = {
    createOrder,
    updateOrder,
    getOrders,
    getOrdersDate,
    updateOrderStatus,
    getLatestOrderNumber,
    updateProductStockInOrder,
    getOrdersExcel,
    getExcelbyDay
};

