// [SECTION] Importing models
const Product = require("../models/Product");
const User = require("../models/User");

const { errorHandler } = require("../auth");

// [SECTION] Product Controllers
module.exports.addProduct = (req, res) => {
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Product.findOne({ name:req.body.name })
    .then(existingProduct => {
        if(existingProduct){
            return res.status(409).send({message: "Product already exists"})
        } else {
            return newProduct.save()
            .then(result => res.send({product: result}))
            .catch(err => errorHandler(err, req, res));
        }
    }).catch(err => errorHandler(err, req, res));
}; 

module.exports.getAllProduct = (req, res) => {

    return Product.find({})
    .then(result => {
        if(result.length > 0){
            return res.status(200).send({products: result});
        }
        else{
            return res.status(404).send({message: "No products found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
    
};

module.exports.getAllActive = (req, res) => {

    Product.find({ isActive: true })
    .then(result => {
        if(result.length > 0){
            return res.status(200).send({products: result});
        } else {
            return res.status(404).send(false);
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getProduct = (req, res) => {
    Product.findById(req.params.productId) // Use req.params.productId instead of req.params.id
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json({ product: product });
        })
        .catch(err => errorHandler(err, req, res));
};

//[SECTION] Update a Procuct

module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }
    Product.findByIdAndUpdate(req.params.productId, updatedProduct, { new: true }) 
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            Product.findById(product._id)
                .then(updatedProduct => {
                    res.json({
                        message: "Product updated successfully",
                        updatedProduct: updatedProduct
                    });
                })
                .catch(err => errorHandler(err, req, res));
        })
        .catch(error => errorHandler(error, req, res));
};

//[SECTION] Archive a Product
module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    };

    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (!product.isActive) {
                return res.status(200).json({ message: 'Product already archived', product: product });
            }
            return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
                .then(updatedProduct => {
                    res.status(200).json({ message: 'Product archived successfully', product: updatedProduct });
                })
                .catch(error => errorHandler(error, req, res));
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.activateProduct = (req, res) => {
    let updateActiveField = {
        isActive: true
    };

    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.isActive) {
                return res.status(200).json({ message: 'Product already activated', product: product });
            }
            return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
                .then(updatedProduct => {
                    res.status(200).json({ message: 'Product activated successfully', product: updatedProduct });
                })
                .catch(error => errorHandler(error, req, res));
        })
        .catch(error => errorHandler(error, req, res));
};
