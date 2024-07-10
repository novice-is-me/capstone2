//[SECTION] Activity: Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth.js");

const { verify, verifyAdmin } = auth;
const router = express.Router();


router.get("/:productId", productController.getProduct);
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

module.exports = router;