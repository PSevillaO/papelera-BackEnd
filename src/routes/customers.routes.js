const express = require('express');
const router = express.Router();
const jwtVerify = require('../middelwares/isAuth');
const isAdmin = require('../middelwares/isAdmin');
const uploadImage = require('../middelwares/uploadCustoImage')

const customersController = require('../controllers/customers.controlles');

router.get('/customers/:id?', customersController.getCustomers);

router.get('/customers/search/:search', customersController.searchCustomers);

router.post('/customers', uploadImage, customersController.createCustomers)

router.delete('/customers/:id?', customersController.deleteCustomers)

router.put('/customers/:id?', uploadImage, customersController.updateCustomers)

module.exports = router;