const express = require('express');
const router = express.Router();
const jwtVerify = require('../middelwares/isAuth');
const isAdmin = require('../middelwares/isAdmin');
const uploadImage = require('../middelwares/uploadOrderImage')

const orderController = require('../controllers/orders.controllers');

router.get('/orders/:id?', orderController.getOrders);

router.get('/orders/date/:date', orderController.getOrdersDate);

router.get('/orders/orden/:date', orderController.getLatestOrderNumber); // me trae el ultimo numero de orden de ese dia

router.get('/orders/excel/:id?', orderController.getOrdersExcel);// genero el excel de cada cards

router.put('/orders/printByDay', orderController.getExcelbyDay);// genero el excel de TODAS las cards del dia

router.post('/orders', uploadImage, orderController.createOrder);

router.put('/orders/:id', uploadImage, orderController.updateOrder);

router.put('/orders/status/:id', orderController.updateOrderStatus);

router.put('/orders/stock/:id', orderController.updateProductStockInOrder); // actualiza el stock de los productos de una orden 

// router.delete('/orders/:id', productController.deleteProduct)

// router.put('/orders/:id', uploadImage, productController.updateProduct)

// router.get('/orders/search/:search', productController.searchProducts);


module.exports = router;