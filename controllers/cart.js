const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const mongoose = require("mongoose");


const auth = require("../auth.js");
const { errorHandler } = auth;




module.exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId: userId });
        if (!cart || cart.cartItems.length === 0) {
            return res.status(404).json({ message: "No items in the cart" });
        }
        return res.status(200).json({ cart: cart });

    } catch (error) {
        return errorHandler(error, req, res);
    }
};


module.exports.updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productName, quantity } = req.body;

        // Retrieve product details to get the product by productName
        const product = await Product.findOne({ name: productName });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create cart for the user
        let cart = await Cart.findOne({ userId: userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({ userId: userId, cartItems: [] });
        }

        // Find the cart item by productId or create a new one
        let cartItem = cart.cartItems.find(item => item.productId === product._id.toString());

        if (cartItem) {
            // Update existing cart item quantity and subtotal
            cartItem.quantity = parseInt(quantity); // Set quantity to the provided value
            cartItem.subtotal = product.price * parseInt(quantity);
        } else {
            // Add new cart item
            cartItem = {
                productId: product._id.toString(),
                productName: product.name,
                quantity: parseInt(quantity),
                subtotal: product.price * parseInt(quantity)
            };
            cart.cartItems.push(cartItem);
        }

        // Update total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        // Respond with the updated cart
        return res.status(200).json({ message: "Item quantity updated successfully", updatedCart: cart });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};