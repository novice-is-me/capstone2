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
