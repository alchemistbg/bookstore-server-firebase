const { firebaseAdmin, firestore } = require('../database/database')
const error = require('./errors/error');
const userMessages = require('../utils/errors/userErrors');

module.exports = (req, res, next) => {
	let token;
	req.user = {};

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
		token = req.headers.authorization.split("Bearer ")[1];
		firebaseAdmin.auth().verifyIdToken(token)
			.then((decodedToken) => {
				return firestore.collection("users").where("userId", "==", decodedToken.uid).limit(1).get();
			})
			.then((data) => {
				req.user = data.docs[0].data();
				return next();
			})
			.catch((fbError) => {
				// console.log(fbError);
				next(new error(userMessages.userInvalidToken));
			});
	} else {
		// token = "empty";
		// next(new error(userMessages.unauthorized));
		return next();
	}

}