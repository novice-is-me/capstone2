// [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User.js");

// Importing auth.js
const auth = require("../auth.js");
const { errorHandler } = auth;

// [SECTION] User Controllers
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

// [SECTION] Controllers
module.exports.loginUser = (req, res) => {
	return User.findOne({ email: req.body.email })
	.then(result => {
		if(result == null){
			return res.send(false);
		} else {
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
			
			if(isPasswordCorrect){
				return res.send({ access: auth.createAccessToken(result) })
			} else {
				return res.send(false);
			}
		}
	})
	.catch(err => errorHandler(error, req, res))
}

module.exports.getProfile = (req, res) => {
	return User.findById(req.user.id)
	.then(user => {
		
		if(!user){
			// if the user has invalid token, send a message 'invalid signature'.
			return res.status(403).send({ message: 'invalid signature' })
		}else {
			// if the user is found, return the user.
			user.password = "";
			return res.status(200).send(user);
		}  
	})
	.catch(error => errorHandler(error, req, res));
};

module.exports.updatePassword = async (req, res) => {
	try {
		const { newPassword } = req.body;
		const { id } = req.user; 
		
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		
		await User.findByIdAndUpdate(id, { password: hashedPassword });
		
		res.status(200).json({ message: 'Password reset successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};


module.exports.updateUserAsAdmin = (req, res) => {
	try{
		const { userId } = req.body;
		
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}
		User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })
		.then(updatedUser => {
			if (!updatedUser) {
				return res.status(404).json({ message: "User not found" });
			}
			return res.status(200).json({ updatedUser: updatedUser });
		})
		.catch(error => errorHandler(error, req, res));
	}catch(error){
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}	
};
