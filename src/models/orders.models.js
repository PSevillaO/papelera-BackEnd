const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        }

    }],
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customers',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    orden: {
        type: Number,
        required: true,
        default: 1,
        unique: false
    },
    obs: { type: String, require: false },
    status: {
        type: String,
        enum: ['Pendiente', 'Procesado', 'Enviado', 'Entregado', 'Pagado', 'Finalizado'],
        default: 'Pendiente'
    },
    // Otros campos que puedas necesitar
});

module.exports = mongoose.model('Order', orderSchema);
