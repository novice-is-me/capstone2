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


module.exports.addToCart = (req, res) => {
    console.log(req.user.id);
    try {
        // Check if the user has an existing cart
        Cart.findOne({ userId: req.user.id })
            .then((cart) => {
                // If the user has a cart, proceed here:
                if (cart) {
                    // Check if the product is already in the cart
                    const existingCartItem = cart.cartItems.find(item => item.productId === req.body.productId);

                    return Product.findById(req.body.productId)
                        .then((product) => {
                            if (!product) {
                                throw new Error("Product not found");
                            }

                            if (existingCartItem) {
                                // Product already exists in cart, update quantity and subtotal
                                existingCartItem.quantity += req.body.quantity;
                                existingCartItem.subtotal = existingCartItem.quantity * product.price;
                            } else {
                                // Product is not in cart, add it as a new cartItem
                                const newSubtotal = req.body.quantity * product.price;
                                cart.cartItems.push({
                                    productId: req.body.productId,
                                    quantity: req.body.quantity,
                                    subtotal: newSubtotal
                                });
                            }

                            // Calculate totalPrice based on cartItems
                            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

                            // Save the updated cart
                            return cart.save()
                                .then((savedCart) => {
                                    const lastItem = savedCart.cartItems[savedCart.cartItems.length - 1];
                                    res.status(200).send({
                                        message: "Item added to cart successfully",
                                        cart: lastItem,
                                        totalPrice: savedCart.totalPrice,
                                        orderedOn: savedCart.orderedOn,
                                        __v: savedCart.__v
                                    });
                                })
                                .catch(error => errorHandler(error, req, res));
                        })
                        .catch(error => errorHandler(error, req, res));
                } else {
                    // User does not have a cart, create a new one
                    return Product.findById(req.body.productId)
                        .then((product) => {
                            if (!product) {
                                throw new Error("Product not found");
                            }

                            const newSubtotal = req.body.quantity * product.price;

                            let newCart = new Cart({
                                userId: req.user.id,
                                cartItems: [{
                                    productId: req.body.productId,
                                    quantity: req.body.quantity,
                                    subtotal: newSubtotal
                                }],
                                totalPrice: newSubtotal // Set totalPrice initially based on the first item
                            });

                            return newCart.save()
                                .then((cart) => {
                                    res.status(200).send({
                                        message: "Item added to cart successfully",
                                        cart: cart
                                    });
                                })
                                .catch(error => errorHandler(error, req, res));
                        })
                        .catch(error => errorHandler(error, req, res));
                }
            })
            .catch(error => errorHandler(error, req, res));
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}



module.exports.updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // Retrieve product details to get the product by productId
        const product = await Product.findById(productId);
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
        let cartItem = cart.cartItems.find(item => item.productId === productId);

        if (cartItem) {
            // Update existing cart item quantity and subtotal
            cartItem.quantity = parseInt(quantity); // Set quantity to the provided value
            cartItem.subtotal = product.price * parseInt(quantity);
        } else {
            // Add new cart item
            cartItem = {
                productId: productId,
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


