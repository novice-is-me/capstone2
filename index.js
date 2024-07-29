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
const cartRouter = require('./routes/cart.js');
const orderRouter = require('./routes/order.js');

// [SECTION] Environment Setup
// assign a prot number for the server to listen to
// const port = 4005;
require("dotenv").config();

// [SECTION] Server setup
const app = express();

// [SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const corsOptions = {
	origin: ["capstone3-r0bvahxec-reggys-projects-f2037f72.vercel.app", 'https://capstone3-eight-sigma.vercel.app/'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));  


// [SECTION] MongoDB Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Backend Routes
app.use("/b5/users", userRoutes);
app.use("/b5/products", productRoutes);
app.use('/b5/cart', cartRouter);
app.use('/b5/order', orderRouter);

// [SECTION] Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4005, () => console.log(`API is now available in port ${process.env.PORT || 4005}`));
} 

module.exports = { app, mongoose };
