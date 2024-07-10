// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
// Import the auth.js and deconstruct it to get our verify function
const passport = require('passport')
const { verify, isLoggedIn } = require("../auth.js");
// [SECTION] Routing Component
const router = express.Router();

//[SECTION] Activity: Routes for duplicate email
// router.post("/check-email", userController.checkEmailExists);

// [SECTION] Route for user registration
router.post("/register", userController.registerUser);

// [SECTION] Route for user authentication
router.post("/login", userController.loginUser);

//[SECTION] Activity: Route for retrieving user details
// The "getProfile" controller method is passed as middleware, the controller will have access to the "req" and "res" objects
// This will also make our code look cleaner and easier to read as our routes no longer with logic
// All business logic will now be handled by the controller.
router.get("/details", verify, userController.getProfile);

// [SECTION] Route to enroll user to a course
// router.post("/enroll", verify, userController.enroll);

// [SECTION] Google Login
// [SECTION] Route for initiating the Google OAuth consent screen
// router.get('/google', 
//     passport.authenticate('google', {
//         scope:['email', 'profile'],
//         prompt: "select_account"
//     })
// );

// // [SECTIOn] Roue for callback URL for Google OAuth authentication
// router.get('/google/callback', 
//     passport.authenticate('google', {
//         failureRedirect: '/users/failed'
//     }),
//     function(req, res){
//         res.redirect('/users/success')
//     }
// );

// router.get("/failed", (req, res) => {
//     console.log("User is not authenticated");
//     res.send("Failed")
// })

// router.get("/success", (req, res) => {
//     console.log("You are logged in");
//     console.log(req.user);
//     res.send(`Welcome ${req.user.displayName}`)
// })

// router.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//         if(err){
//             console.log('Error while destroying session', err);
//         } else {
//             req.logout(() => {
//                 console.log('You are logged out');
//                 res.redirect('/');
//             })
//         }
//     })
// })

// PATCH route for resetting the password


// Update user profile route
// router.put('/profile', verify, userController.updateProfile);

router.put("/:id/set-as-admin", verify, userController.updateUserAsAdmin);

// router.put("/update-status", verify, userController.updateEnrollmentStatus);

router.patch('/update-password', verify, userController.updatePassword);

// [SECTION] Export Route System
module.exports = router;