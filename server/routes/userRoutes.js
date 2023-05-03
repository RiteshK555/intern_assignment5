const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);

router.get('/', userController.getAllUsers);

router.post('/change_password', userController.setPasswordById);



router.post('/login', userController.loginUser);


router.get('/:id', userController.getUserById);

router.post('/:id', userController.setUser);


module.exports = router;
