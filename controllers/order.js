const Cart = require("../models/Cart.js");
const Order = require("../models/Order.js");
const mongoose = require("mongoose");


const auth = require("../auth.js");
const { errorHandler } = auth;



module.exports.checkOut = async (req, res) => {
    try {
        // 1. Verify user identity via JWT (handled by the verify middleware)
        const userId = req.user.id; // assuming req.user is set by verify middleware

        // 3. Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            // 4. If no cart document with the current user's id can be found, send a message to the client
            return res.status(404).json({ error: "No cart found for this user." });
        }

        
        if (cart.cartItems.length === 0) {
            
            return res.status(400).json({ error: "No items to Checkout" });
        }

      
        const newOrder = new Order({
            userId: cart.userId,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice,
        });

       
        const savedOrder = await newOrder.save();

        
        res.status(201).json({
            message: "Ordered successfully."
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};