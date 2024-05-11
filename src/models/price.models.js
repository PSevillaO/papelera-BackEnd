const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    archivo: { type: String, required: false, trim: true, }
});

module.exports = mongoose.model('Price', priceSchema);
