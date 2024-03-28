const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({ //propiedades de la collection //barreras para cargar el usuario  
    image: { type: String, required: false, trim: true, },
    articulo: { type: String, required: false, minlength: 4, maxlenght: 60, trim: true, },
    descripcion: { type: String, required: true, minlength: 4, maxlenght: 60, trim: true, },
    detalle: { type: String, required: false, minlength: 4, maxlenght: 60, trim: true, },
    presentacion: { type: String, required: false, minlength: 4, maxlenght: 60, trim: true, },
    unidad: { type: String, required: false, },
    precio: { type: Number, required: true, min: 1, max: 10000000, },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        minlength: 4,
        maxlenght: 60,
        trim: true
    },
    stock: { type: Number, required: false, min: 1, max: 10000000, default: 0 },
    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    suppliers: [{
        supplier: { type: Schema.Types.ObjectId, ref: "Suppliers" },
        precio: { type: Number, required: true, min: 0 }
    }]
});

module.exports = mongoose.model('Product', productSchema) 