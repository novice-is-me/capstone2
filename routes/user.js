// [SECTION] Importing Packages
const express = require('express');

// [SECTION] Importing Controllers
const userController = require('../controller/user.js');

// [SECTION] Importing Auth
const {verify, verifyAdmin} = require('../auth.js'); 

// [SECTION] Importing Authentication Middleware

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Routes for User
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/details', verify, userController.getDetails); //Authenticated user
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.setAsAdmin); //Admin Only
router.patch('/update-password', verify, userController.updatePassword); //Authenticated User

module.exports = router;