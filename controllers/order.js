const Order = require("../models/Order.js");

const auth = require("../auth.js");
const { errorHandler } = auth;

// [SECTION] Controllers
module.exports.getOrders = (req, res) =>{
    try{
        Order.find({userId: req.user.id})
        .then((results) =>{
            if(results){
                return res.status(200).send({orders: results});
            }else{
                return res.status(404).send({message: "No orders found"});
            }
        }).catch(error => errorHandler(error, req, res));
    }catch(error){
        console.error(error);
		res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getAllOrders = (req, res) =>{
    try{    
        Order.find({})
        .then((results) =>{
            if(results){
                return res.status(200).send({orders: results})
            }else{
                return res.status(400).send({message: "No orders found"})
            }
        }).catch(error => errorHandler(error, req, res));
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}
