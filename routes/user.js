// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
// Import the auth.js and deconstruct it to get our verify function
const { verify, verifyAdmin } = require("../auth.js");
// [SECTION] Routing Component
const router = express.Router(); 

// [SECTION] Route for user registration
router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

router.put('/reset-password', verify, userController.resetPassword);

router.get('/profile', verify, verifyAdmin, userController.getAllProfile);
router.put('/update-profile', verify, userController.updateProfile);

// [SECTION] Export Route System
module.exports = router;