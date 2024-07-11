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

module.exports.addToCart = (req, res) =>{
    try{
        const userId = req.user.id;
        const {productId, quantity} = req.body;

        // Find the users cart
        Cart.findOne({userId: userId})
        .then((existingCart) =>{
            return Product.findById(productId)
            .then((existingProduct) =>{
                if(!existingProduct){
                    return res.status(404).send({message: "Product not found"})
                }
                // if user has already a cart
                if(existingCart){
                    // Fin the specific product in the cart
                    let existingItem = existingCart.cartItems.find(item => item.productId === productId)
                    
                    // If the product is existing in the cart
                    if(existingItem){
                        // Update the quantity and subtotal
                        existingItem.quantity += quantity;
                        existingItem.subtotal = existingItem.quantity * existingProduct.price;

                        // Update the total price
                        existingCart.totalPrice = existingCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

                        return existingCart.save()
                        .then((updatedCard) => {
                            res.status(200).send({
                                message: "Added to cart successfully",
                                cart: updatedCard
                            })
                        })
                        .catch(error => errorHandler(error, req, res));
                    }
                    // If the product is not existing in the cart
                    else{
                        existingCart.cartItems.push({
                            productId: productId,
                            quantity: quantity,
                            subtotal: existingProduct.price * quantity
                        })

                        // Update the total price
                        existingCart.totalPrice = existingCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

                        return existingCart.save()
                        .then((updatedCard) => {
                            res.status(200).send({
                                message: "Added to cart successfully",
                                cart: updatedCard
                            })
                        })
                        .catch(error => errorHandler(error, req, res));
                    }
                // If user has no cart
                }else{
                    let newSubtotal = existingProduct.price * quantity
                    let newCart = new Cart({
                        userId: userId,
                        cartItems:[
                            {
                                productId: productId,
                                quantity: quantity,
                                subtotal: newSubtotal
                            }
                        ],
                        totalPrice: newSubtotal
                    })

                    return newCart.save()
                    .then((cart) =>{
                        res.status(200).send({
                            message: "Added to cart successfully",
                            cart: cart
                        })
                    })
                    .catch(error => errorHandler(error, req, res));
                }

            }).catch(error => errorHandler(error, req, res));
        }).catch(error => errorHandler(error, req, res));

    }catch(err){
        console.error(err);
        res.status(500).send({message: "Internal Server Error"});
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

module.exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: "No cart found for the user" });
        }

        // Find the index of the cart item to be removed
        const itemIndex = cart.cartItems.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Remove the item from the cart
        cart.cartItems.splice(itemIndex, 1);

        // Update the total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        // Respond with the updated cart
        return res.status(200).json({ message: "Item removed from the cart successfully", updatedCart: cart });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: "No cart found for the user" });
        }

        // Check if the cart has at least one item
        if (cart.cartItems.length === 0) {
            return res.status(404).json({ message: "Cart is already empty" });
        }

        // Remove all items from the cart
        cart.cartItems = [];
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        // Respond with the updated cart
        return res.status(200).json({ message: "Cart cleared successfully", cart: cart });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
