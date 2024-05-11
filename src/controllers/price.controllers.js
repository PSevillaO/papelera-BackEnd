const Price = require('../models/price.models');
const xlsx = require('xlsx');


async function createPrice(req, res) {
    try {
        const price = new Price(req.body)

        // con esto cargo el nombre de la imagen en el usuario
        if (req.file?.filename) {
            price.archivo = req.file.filename;
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // Supongamos que solo hay una hoja en el archivo Excel
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        const priceSave = await price.save();

        // Devolver los datos en formato JSON
        res.status(200).send({
            ok: true,
            message: "Contenido del archivo Excel leído correctamente",
            data: jsonData,
            price: priceSave
        });

        // res.status(201).send({
        // ok: true,
        // message: "Precio Creado correctamente",
        // price: priceSave
        // });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo crear el precio"
        });
    }
}



module.exports = {
    createPrice
}