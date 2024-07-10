// Basic ExpressJS Server Setup
// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
// Google Login
// const passport = require("passport");
const session = require("express-session");

const cors = require("cors");

// [SECTION] Routes
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");

// [SECTION] Environment Setup
// assign a prot number for the server to listen to
// const port = 4000;
require("dotenv").config();

// [SECTION] Server setup
const app = express();

// [SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const corsOptions = {
	origin: ["http://localhost:8000"],
	credentials: true,
	optionsSuccessStatus: 200
}


// [SECTION] MongoDB Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);

// [SECTION] Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4000, () => console.log(`API is now available in port ${process.env.PORT || 4000}`));
}

module.exports = { app, mongoose };
