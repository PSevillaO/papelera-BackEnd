const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadMulter = multer({
    storage: storage,
})

const upload = uploadMulter.single('image'); // campo de la req donde viene el archivo

module.exports = upload;