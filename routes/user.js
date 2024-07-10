// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
// Import the auth.js and deconstruct it to get our verify function
const passport = require('passport')
const { verify, isLoggedIn } = require("../auth.js");
// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Route for user registration
router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.put("/:id/set-as-admin", verify, userController.updateUserAsAdmin);

router.patch('/update-password', verify, userController.updatePassword);

// [SECTION] Export Route System
module.exports = router;