// [SECTION] Dependencies and Modules
// The "bcrypt" package is one of many packages that we can use to encrypt information
const bcrypt = require('bcrypt');
// The "User" variable is defined using a capitalized letter to indicate that we are using is the "User" model for code readability
const User = require("../models/User.js");
// Import the enrollment model
const Products = require("../models/Product");
// Importing auth.js
const auth = require("../auth.js");
const { errorHandler } = auth;

// [SECTION] User Registration
/*
	Business Logic:
		1. Create a new User object using the mongoose model and the information from the request body
		2. Make sure that the password is encrypted
		3. Save the new User to the database
*/
module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
    }

    if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ error: "Mobile number invalid" });
    }

    if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    }

    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: bcrypt.hashSync(req.body.password, 10)
    });

    return newUser.save()
        .then((result) => {
            res.status(201).send({ message: "Registered successfully"});
        })
        .catch(error => errorHandler(error, req, res));
};


//[SECTION] Check if the email already exists
/*
    Steps: 
    1. Use mongoose "find" method to find duplicate emails
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.checkEmailExists = (req, res) => {
	if(req.body.email.includes("@")){
		return User.find({ email : req.body.email })
		.then(result => {
	    	// If there is a duplicate email, send true with the status code back to the client
			if (result.length > 0) {
	        	// 409 is the http status code for duplicate record which is used when there is another resource with the same data in the request
				return res.status(409).send({message: "Duplicate email found"});
	        // else, there is no duplicate email, send false with the status code back to the client
			} else {
	        	// 404 http status code refers to documents or resources that are not found
				return res.status(404).send({message: "No email found"});
			};
		})
		.catch(error => errorHandler(error, req, res));
	}else{
		res.status(400).send(false)
	}
};

// [SECTION] User authentication
/*
	Steps:
	1. Check the database if the user email exists
	2. Compare the password provided in the login form with the password stored in the database
	3. Generate/return a JSON web token if the user is successfully logged in and return false if not
*/
module.exports.loginUser = (req, res) => {
    // Validate email format
    if (!isValidEmail(req.body.email)) {
        return res.status(400).send({ error: "Invalid email" });
    }

    return User.findOne({ email: req.body.email })
        .then(result => {
            if (!result) {
                return res.status(404).send({ error: "No Email Found" });
            }

            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

            if (isPasswordCorrect) {
                return res.send({ access: auth.createAccessToken(result) });
            } else {
                return res.status(401).send({ error: "Email and password do not match" });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

// Function to validate email format
function isValidEmail(email) {
    // Use a simple regex for email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//[Section] Activity: Retrieve user details
/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
// The "getProfile" method/function became a middleware, now has access to the "req" and "res" objects because of the "next" function in the "verify" method/function
module.exports.getProfile = (req, res) => {
	// The "return" keyword ensures the end of the getProfile method
	// Since getProfile is now used as a middleware it should have access to "req.user" if the "verify" method is used before it
	// Order of middleware is crucial. This is because the "getProfile" method/function is the "next" function to the "verify" method, it receives the updated request with the user id from it
	return User.findById(req.user.id)
	.then(user => {

		if(!user){
                // if the user has invalid token, send a message 'invalid signature'.
			return res.status(404).send({ error: 'User not found' })
		}else {
                // if the user is found, return the user.
			user.password = "";
			return res.status(200).send(user);
		}  
	})
	.catch(error => errorHandler(error, req, res));
};

// [SECTION] Enroll a user to a course
/*
	Steps:
	1. Verify if the authenticated user is admin or not
	2. If the user is admin, return false boolean value
	3. If the user is not an admin, we're going to create a new Enrollment object
	4. Save the created Enrollment object into our database
	5. After saving the created object, return true boolean value
*/

// module.exports.enroll = (req, res) => {
// 	// The user's id from the decoded token after verify()
// 	console.log(req.user.id);
// 	// The course from our request body
// 	console.log(req.body.enrolledCourses);

// 	if(req.user.isAdmin){
// 		// Admins should not be allowed to enroll to a course, so we need the "verify" to check the req.user.isAdmin hence stopping the request.
// 		return res.status(403).send(false);
// 	}

// 	let newEnrollment = new Enrollment({
// 		userId : req.user.id,
// 		enrolledCourse : req.body.enrolledCourse,
// 		totalPrice: req.body.totalPrice
// 	})

// 	return newEnrollment.save()
// 	.then(enrolled => {
// 	        // if the user successfully enrolled,return true and send a message 'Enrolled successfully'.
// 		return res.status(201).send({
// 			success: true,
// 			message: 'Enrolled successfully'
// 		});
// 	})
// 	.catch(error => errorHandler(error, req, res));
// }


// module.exports.getEnrollments = (req, res) => {
// 	return Enrollment.find({userId : req.user.id})
// 	.then(enrollments => {
// 		if (enrollments.length > 0) {
//                 // if there are enrolled courses, return the enrollments.
// 			return res.status(200).send(enrollments);
// 		}
//             // if there is no enrolled courses, send a message 'No enrolled courses'.
// 		return res.status(404).send({
// 			message: 'No enrolled courses'
// 		});
// 	})
// 	.catch(error => errorHandler(error, req, res));
// };

// // Function to reset the password
module.exports.updatePassword = async (req, res) => {
	try {
	  const { newPassword } = req.body;
	  const { id } = req.user; // Extracting user ID from the authorization header
  
	  // Hashing the new password
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
	  // Updating the user's password in the database
	  await User.findByIdAndUpdate(id, { password: hashedPassword });
  
	  // Sending a success response
	  res.status(200).json({ message: 'Password reset successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };

  // Controller function to update the user profile
// module.exports.updateProfile = async (req, res) => {
// 	try {
// 	  // Get the user ID from the authenticated token
// 	  const userId = req.user.id;
  
// 	  // Retrieve the updated profile information from the request body
// 	  const { firstName, lastName, mobileNo } = req.body;
  
// 	  // Update the user's profile in the database
// 	  const updatedUser = await User.findByIdAndUpdate(
// 		userId,
// 		{ firstName, lastName, mobileNo },
// 		{ new: true }
// 	  );
  
// 	  res.json(updatedUser);
// 	} catch (error) {
// 	  console.error(error);
// 	  res.status(500).json({ message: 'Failed to update profile' });
// 	}
//   };

  module.exports.updateUserAsAdmin = (req, res) => {
	const { userId } = req.body;
  
	if (!userId) {
	  return res.status(400).json({ message: "User ID is required" });
	}
  
	User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })
	  .then(updatedUser => {
		if (!updatedUser) {
		  return res.status(404).json({ message: "User not found" });
		}
  
		// Return success message if update is successful
		return res.status(200).json({ message: "User updated as admin successfully" });
	  })
	  .catch(error => errorHandler(error, req, res));
  };

//   module.exports.updateEnrollmentStatus = async (req, res) => {
// 	try {
// 	  const { userId, courseId, status } = req.body;
  
	  
// 	  if (!userId || !courseId || !status) {
// 		return res.status(400).json({ error: "Missing required fields" });
// 	  }
  
	  
// 	  const updatedEnrollment = await Enrollment.findOneAndUpdate(
// 		{ userId, "enrolledCourse.courseId": courseId },
// 		{ $set: { "enrolledCourse.$.status": status } },
// 		{ new: true }
// 	  );
  
// 	  // Check if enrollment was found and updated
// 	  if (updatedEnrollment) {
// 		return res.status(200).json({
// 		  success: true,
// 		  message: `Enrollment status updated to '${status}' successfully`,
// 		  enrollment: updatedEnrollment
// 		});
// 	  } else {
// 		return res.status(404).json({ error: "Enrollment not found" });
// 	  }
// 	} catch (error) {
// 	  console.error(error);
// 	  res.status(500).json({ error: "Internal Server Error" });
// 	}
//   };