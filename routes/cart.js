const express = require("express");
const cartController = require("../controllers/cart.js");
const { verify } = require("../auth.js");

const router = express.Router();

router.get('/get-cart', verify, cartController.getCart);
router.patch('/update-cart-quantity', verify, cartController.updateCartQuantity);
module.exports = router;