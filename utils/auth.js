const { firebaseAdmin, firestore } = require('../database/database')

module.exports = (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
		token = req.headers.authorization.split("Bearer ")[1];
		// console.log("Auth file: ", token);
	} else {
		const error = new Error("Invalid data");
		error.status = 403;
		error.code = "auth/unauthorized";
		error.message = "Unauthorized";
		throw error;
	}

	firebaseAdmin.auth().verifyIdToken(token)
		.then((decodedToken) => {
			req.user = {};
			// req.user = { ...decodedToken };
			// return firestore.collection("users").where("userId", "==", req.user.uid).limit(1).get();
			return firestore.collection("users").where("userId", "==", decodedToken.uid).limit(1).get();
		})
		.then((data) => {
			req.user = data.docs[0].data();
			// console.log(req.user.username);
			return next();
		})
		.catch((fbError) => {
			// console.log(fbError);
			// next(fbError);
			// error.fbError = 403;
			const error = new Error("Invalid data");
			error.status = 403;
			error.code = "auth/argument-error";
			error.message = "Error while verifying token";
			next(error);
			// throw error;
		});
}