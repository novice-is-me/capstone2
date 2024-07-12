const express = require("express");
const orderController = require('../controllers/order.js');

const { verify, verifyAdmin } = require("../auth.js");

// [SECTION] Routing Component
const router = express.Router(); 

// [SECTION] Routes
router.get('/my-orders', verify, orderController.getOrders);
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;


