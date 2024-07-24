// [SECTION] Dependencies and Modules
const express = require("express");
const productController = require('../controllers/product.js');

const { verify, verifyAdmin } = require("../auth.js");

// [SECTION] Routing Component
const router = express.Router(); 

router.post("/", verify, verifyAdmin, productController.addProduct); 
router.get("/all", verify, verifyAdmin, productController.getAllProduct);
router.get("/active", productController.getAllActive);
router.get("/", productController.getAllProduct);

router.get("/:productId", productController.getProduct);
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

router.post("/search-by-name", productController.searchByName);
router.post("/search-by-price", productController.searchByPrice);
module.exports = router;