const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customersSchema = new Schema({
    nombre: { type: String, required: true, trim: true },
    razon_social: { type: String, required: false, trim: true },
    direccion: { type: String, required: false, trim: true },
    cuit: { type: String, required: false, trim: true },
    horario: { type: String, required: false, trim: true },
    telefono: { type: String, required: false, trim: true },
    email: { type: String, required: false, trim: true },
    obs: { type: String, required: true, trim: true },
});

module.exports = mongoose.model('Customers', customersSchema);