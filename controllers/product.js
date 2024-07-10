const Product = require("../models/Product");
const User = require("../models/User");
// const Enrollment = require("../models/Enrollment");
const { errorHandler } = require("../auth");


module.exports.addProduct = (req, res) => {

    // try{
    // Creates a variable "newCourse" and instantiates a new "Course" object using the mongoose model
    // Uses the information from the request body to provide all the necessary information
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    // Saves the created object to our database
    Product.findOne({ name:req.body.name })
    .then(existingProduct => {
        if(existingProduct){
            return res.status(409).send({message: "Product already exists"})
        } else {
            return newProduct.save()
            .then(result => res.send({
                success: true,
                message: "Product added successfully",
                result: result
            }))
            .catch(err => errorHandler(err, req, res));
        }
    }).catch(err => errorHandler(err, req, res));
}; 


//[SECTION] Activity: Retrieve all courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllProduct = (req, res) => {

    return Product.find({})
    .then(result => {
        // if the result is not null send status 200 and its result
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            // 404 for not found courses
            return res.status(404).send({message: "No products found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
    
};

//[SECTION] Retrieve all active courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method with the "isActive" field values equal to "true"
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllActive = (req, res) => {

    Course.find({ isActive: true })
    .then(result => {
        // If the result is not null
        if(result.length > 0){
            // send the result as a response
            return res.status(200).send(result);
        // else, there are no results found
        } else {
            // send a false boolean value
            return res.status(404).send(false);
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve a specific course
/*
    Steps: 
    1. Retrieve a course using the mongoose "findById" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getProduct = (req, res) => {

    Product.findById(req.params.id)
    .then(course => res.send(course))
    .catch(err => errorHandler(err, req, res));
};

//[SECTION] Update a course
/*
    Steps: 
    1. Create an object containing the data from the request body
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    // findByIdandUpdate() finds the the document in the db and updates it automatically
    // req.body is used to retrieve data from the request body, commonly through form submission
    // req.params is used to retrieve data from the request parameters or the url
    // req.params.courseId - the id used as the reference to find the document in the db retrieved from the url
    // updatedCourse - the updates to be made in the document
    return Product.findByIdAndUpdate(req.params.courseId, updatedProduct)
    .then(product => {
        if (product) {
            res.send(true);
        } else {
            res.send(false);
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Archive a course
/*
    Steps: 
    1. Create an object and with the keys to be updated in the record
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. If a course is updated send a response of "true" else send "false"
    4. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method
*/
module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    };

    Product.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then(product => {
        if (product) {
            if (!product.isActive) {
                        //if the course isActive is already false, send a message 'Course already archived' and return the course.
                return res.status(200).send({ 
                    message: 'Product already archived',
                    product: product
                });
            }
                    //if the course is successfully archived, return true and send a message 'Course archived successfully'.
            return res.status(200).send({ 
                success: true, 
                message: 'Product archived successfully'
            });
        } else {
                    //if the course is not found, return 'Course not found'
            return res.status(404).send({ message: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Activate a course
/*
    Steps: 
    1. Create an object and with the keys to be updated in the record
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. If the user is an admin, update a course else send a response of "false"
    4. If a course is updated send a response of "true" else send "false"
    5. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method
*/
module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }

    Product.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then(product => {
        if (product) {
            if (product.isActive) {
                    // if the course isActive is already true, send a message 'Course already activated', and return the course.
                return res.status(200).send({ 
                    message: 'Product already activated', 
                    product: product
                });
            }
                //if the course is successfully activated, return true and send a message 'Course activated successfully'.
            return res.status(200).send({
                success: true,
                message: 'Product activated successfully'
            });
        } else {
                // if the course is not found, return 'Course not found'
            return res.status(404).send({ message: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Controller action to search for courses by course name
module.exports.searchProductByName = async (req, res) => {
    try {
      const { productName } = req.body;
  
      // Use a regular expression to perform a case-insensitive search
      const products = await Product.find({
        name: { $regex: productName, $options: 'i' }
      });
  
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//   module.exports.getEmailsOfEnrolledUsers = async (req, res) => {
//     const courseId = req.params.courseId;

//     try {
//         // Find enrollments by courseId
//         const enrollments = await Enrollment.find({ 'enrolledCourse.courseId': courseId });
//     if (!enrollments.length) {
//                 return res.status(404).json({ message: 'Course not found' });
//             }
//     // Get the userIds of enrolled users from the enrollments
//             const userIds = enrollments.map(enrollment => enrollment.userId);
//     // Find the users with matching userIds
//             const enrolledUsers = await User.find({ _id: { $in: userIds } });
//     // Extract the emails from the enrolled users
//             const emails = enrolledUsers.map(user => user.email);
//     res.status(200).json({ userEmails: emails });
//         } catch (error) {
//             res.status(500).json({ message: 'An error occurred while retrieving enrolled users' });
//         }
//     };

    module.exports.searchProductsByPriceRange = async (req, res) => {
        try {
          const { minPrice, maxPrice } = req.body;
      
          
          const products = await Course.find({
            price: { $gte: minPrice, $lte: maxPrice }
          });
      
          
          res.json(products);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };