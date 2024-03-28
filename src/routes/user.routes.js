const express = require('express');
const router = express.Router();
const jwtVerify = require('../middelwares/isAuth');


const userController = require('../controllers/user.controllers');
const uploadImage = require('../middelwares/uploadUserImage')


// Busca todos los Usuario
// agrego un middewre de verificacion de token 
router.get('/users/:id?', userController.getUsers)

// Agregamos un usuario
router.post('/users', uploadImage, userController.createUser)

// Borramos un usuario
router.delete('/users/:idUser', userController.deleteUser)

// Actualizamos un usuario
router.put('/users/:idUser', uploadImage, userController.updateUser)

router.post('/login', userController.login)

// Buscamos un usuario especifico
router.get('/users/search/:search', userController.searchUsers);

router.put('/users/pass/:idUser', userController.updatePass);


module.exports = router;