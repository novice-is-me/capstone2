// Basic ExpressJS Server Setup
// [SECTION] Dependencies and Modules
// require() method is use to load/import modules and packages into our application
// express() modules allows use to easily create a server.
const express = require("express");
const mongoose = require("mongoose");
// Google Login
// const passport = require("passport");
const session = require("express-session");
// require('./passport.js')
// cors() modules allows our backend application to be available to our frontend application
// Cross-Origin Resource Sharing
const cors = require("cors");

// [SECTION] Routes
const userRoutes = require("./routes/user.js");
//[SECTION] Activity: Allows access to routes defined within our application
const courseRoutes = require("./routes/product");

// [SECTION] Environment Setup
// assign a prot number for the server to listen to
// const port = 4000;
require("dotenv").config();

// [SECTION] Server setup
// create an "app" variable that will store the expess function/server
// in layman term, app is our server
const app = express();

// [SECTION] Middlewares
// allows our server to handle data from requests
// allows our app to receive the json data and convert it to js object
app.use(express.json());
// allows our app to receive data/information in other data types aside from strings/arrays
app.use(express.urlencoded({extended: true}));

// there are the CORS aoptions used to meet you specific requirements
const corsOptions = {
	// allows requests from the clients URL
	// there are instances where you need to allow multiple client URL
	origin: ["http://localhost:8000"],
	// Allow only the specified HTTP methods
	// methods: ["GET", "POST"],
	// Allow only the specified headers
	// allowedHeaders: ["Content-Type", "Authorization"],
	// allows the use of credentials
	credentials: true,
	// Provides a status code to use for successful OPTIONS request
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// [SECTION] Google Login
// Creates a session with the given data
// A session refers to a way to store informatio nabout a user across multiple interactions (requests) with a web application
// resave prevents the session from overwriting the secret while the session is active
// saveUnintialized prevents the data from storing data in the session while the data has not yet been initialized
// app.use(session({
// 	secret: process.env.clientSecret,
// 	resave: false,
// 	saveUninitialized: false
// }));

// // Initialize the passport package when the application runs
// app.use(passport.initialize());

// // creates a session using the passport package
// app.use(passport.session());

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Backend Routes
// Defines the "/users" string to be included for all user routes defined in the "user" route file
// Groups all routes in userRoutes under "/users"
app.use("/users", userRoutes);
//[SECTION] Activity: Add course routes
// app.use("/products", productRoutes);

// [SECTION] Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4000, () => console.log(`API is now available in port ${process.env.PORT || 4000}`));
}

module.exports = { app, mongoose };