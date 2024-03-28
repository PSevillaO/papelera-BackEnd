const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suppliersSchema = new Schema({
    nombre: { type: String, required: true, trim: true },
    direccion: { type: String, required: false, trim: true },
    telefono: { type: String, required: false, trim: true },
    email: { type: String, required: false, trim: true },
});

module.exports = mongoose.model('Suppliers', suppliersSchema);