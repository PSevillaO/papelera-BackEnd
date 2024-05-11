const express = require('express');
const router = express.Router();
const jwtVerify = require('../middelwares/isAuth');
const isAdmin = require('../middelwares/isAdmin');
const uploadFile = require('../middelwares/uploadPriceExcel')
// const uploadImage = require('../middelwares/uploadOrderImage')

const priceController = require('../controllers/price.controllers');


router.post('/price', uploadFile, priceController.createPrice)

module.exports = router;