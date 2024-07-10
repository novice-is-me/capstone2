// [SECTION] Importing Dependencies
const express = require('express');
const mongoose = require('mongoose');

// [SECTION] For Google OAuth
// const passport = require('passport');
// const session = require('express-session');
// require('./passport.js');

const cors = require('cors');

// [SECTION] Importing Routes
// const userRoutes = require('./routes/user.js');

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Server Setup
const app = express();

// [SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ["http://localhost:8000"],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// [SECTION] For Google Auth
// app.use(session({
// 	secret: process.env.clientSecret,
// 	resave: false,
// 	saveUninitialized: false
// }))
// app.use(passport.initialize());
// app.use(passport.session());

// [SECTION] MongoDB Connection

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Routes
// app.use("/users", userRoutes);

// [SECTION] Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4000, () => console.log(`API is now available in port ${process.env.PORT || 4000}`));
}

module.exports = { app, mongoose };
