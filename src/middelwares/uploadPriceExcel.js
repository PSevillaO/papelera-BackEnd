const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/file/price')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadMulter = multer({
    storage: storage,
})

const upload = uploadMulter.single('archivo'); // campo de la req donde viene el archivo

module.exports = upload;