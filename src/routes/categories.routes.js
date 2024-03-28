const express = require('express');
const router = express.Router();
const jwtVerify = require('../middelwares/isAuth');
const uploadImage = require('../middelwares/uploadCategoriesImage')

const categoryControllers = require('../controllers/categories.controllers')


router.get('/categories', categoryControllers.getCategories)

router.post('/categories', uploadImage, categoryControllers.createCategory)

router.put('/categories/:id?', uploadImage, categoryControllers.updateCategory)

router.delete('/categories/:id?', categoryControllers.deleteCategory)



module.exports = router;