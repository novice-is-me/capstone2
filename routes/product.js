// [SECTION] Dependencies and Modules
const express = require("express");
const productController = require('../controllers/product.js');

const { verify, verifyAdmin } = require("../auth.js");

// [SECTION] Routing Component
const router = express.Router(); 

router.post("/", verify, verifyAdmin, productController.addProduct); 
router.get("/all", verify, verifyAdmin, productController.getAllProduct);
router.get("/active", productController.getAllActive);

// [SECTION] Export Route System
module.exports = router;