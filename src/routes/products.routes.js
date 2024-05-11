const express = require('express');
const router = express.Router();
const jwtVerify = require('../middelwares/isAuth');
const isAdmin = require('../middelwares/isAdmin');
const uploadImage = require('../middelwares/uploadProdImage')

const productController = require('../controllers/products.controllers');

router.get('/products/:id?', productController.getProduct);

router.post('/products', uploadImage, productController.createProduct)

router.delete('/products/:id', productController.deleteProduct)

router.put('/products/:id', uploadImage, productController.updateProduct)

router.get('/products/search/:search', productController.searchProducts);


module.exports = router;