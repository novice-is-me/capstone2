const Cart = require('../models/Cart.js');
const Product = require('../models/Product.js');
const { errorHandler } = require("../auth.js"); // Import errorHandler directly

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
