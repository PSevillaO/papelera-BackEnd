const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    descripcion: {
        type: String,
        required: false,
        trim: true,
        maxlength: 255
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }

});

module.exports = mongoose.model('Category', categorySchema);
