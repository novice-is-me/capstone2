const express = require("express");
const orderController = require("../controllers/order.js");
const { verify } = require("../auth.js");

const router = express.Router();


router.post('/checkout', verify, orderController.checkOut);
module.exports = router;