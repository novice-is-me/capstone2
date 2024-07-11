// [SECTION] Dependencies and Modules
const express = require("express");
const { verify, verifyAdmin } = require("../auth.js");

const cartController = require('../controllers/cart.js');

// [SECTION] Routing Component
const router = express.Router(); 

// [SECTION] Cart Routes
router.post('/add-to-cart', verify, cartController.addToCart);

// [SECTION] Export Route System
module.exports = router;