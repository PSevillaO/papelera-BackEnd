const express = require('express');
const router = express.Router();
const jwtVerify = require('../middelwares/isAuth');
const isAdmin = require('../middelwares/isAdmin');
const uploadImage = require('../middelwares/uploadSuppImage')

const suppliersController = require('../controllers/suppliers.controllers');

router.get('/suppliers/:id?', suppliersController.getSuppliers);

router.get('/suppliers/search/:search', suppliersController.searchSuppliers);

router.post('/suppliers', uploadImage, suppliersController.createSuppliers)

router.delete('/suppliers/:id?', suppliersController.deleteSuppliers)

router.put('/suppliers/:id?', uploadImage, suppliersController.updateSuppliers)

module.exports = router;