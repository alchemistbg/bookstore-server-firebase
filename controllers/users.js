const { firebaseAdmin, firestore, firebase } = require('../database/database');
const error = require('../utils/errors/error');
const userMessages = require('../utils/errors/userErrors');

module.exports = {
	register: (req, res, next) => {
		const newUser = { ...req.body };
		let userId, token;
		firestore.doc(`/users/${newUser.username}`).get()
			.then((user) => {
				if (user.exists) {
					const error = new Error("Invalid data");
					error.status = 400;
					error.code = "auth/username-already-in-use";
					error.message = "The username is already in use!";
					throw error;
					// next(error);
					// return;
				} else {
					return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
				}
			})
			.then((userData) => {
				userId = userData.user.uid;
				return userData.user.getIdToken();
			})
			.then((idToken) => {
				token = idToken;
				const newUserData = {
					userId: userId,
					// personalInfo: {
					//     firstname: newUser.firstname,
					//     lastname: newUser.lastname,
					// },
					firstname: newUser.firstname,
					lastname: newUser.lastname,
					username: newUser.username,
					email: newUser.email,
					// imageUrl: 'image',
					role: "user",
					registeredAt: new Date().toISOString()
				}
				return firestore.doc(`/users/${newUser.username}`).set(newUserData);
			})
			.then((arguments) => {
				console.log(arguments);
				res
					.status(201)
					.json({
						token
					});
			})
			.catch((fsError) => {
				fsError.status = fsError.status || 400;
				next(fsError);
			});
	},

	login: (req, res, next) => {
		const userData = { ...req.body };

		let user = {};
		let idToken = null;

		if (!userData.loginID.includes("@")) {
			console.log(userData);
			firestore.doc(`/users/${userData.loginID}`).get()
				.then((userSnapshot) => {
					if (!userSnapshot.exists) {
						return res.status(404).json({
							message: "Unknown username"
						});
					}
					else {
						user = { ...userSnapshot.data() }
						console.log(user);
						return firebase.auth().signInWithEmailAndPassword(userSnapshot.data().email, userData.password)

					}
				}).then((userData) => {
					return userData.user.getIdToken()
				})
				.then((token) => {
					res.status(200).json({
						token,
						user
					});
				})
				.catch((fsError) => {
					fsError.status = fsError.status || 400;
					next(fsError);
				});
		} else {
			console.log(userData.loginID)
			firebase.auth().signInWithEmailAndPassword(userData.loginID, userData.password)
			.then((userData) => {
				return userData.user.getIdToken();
			})
			.then((token) => {
					idToken = token;
					return firestore.collection(`users`).where("email", "==", userData.loginID).get();
				})
				.then((userQuery) => {
					res.status(200).json({
						idToken,
						user: userQuery.docs[0].data()
					});
			})
				.catch((fsError) => {
					fsError.status = fsError.status || 400;
					next(fsError);
			});
		}
	},

	getProfile: (req, res, next) => {
		// const userData = {};
		// console.log(req.user.username);
		// console.log(req.params.username);
		if (req.user.username != req.params.username) {
			res.json({
				message: "Public profile"
			});
		} else {
			res.json({
				message: "Private profile"
			});
		}
	},

	updateProfile: (req, res, next) => {
		const updatedUserData = { ...req.body };

		if (req.user.username !== req.params.username) {
			next(new error(userMessages.userUnauthenticated));
		} else {
			firestore.doc(`users/${req.user.username}`).get()
				.then((userSnapshot) => {
					if (!userSnapshot.exists) {
						next(new error("", 1000, "", ""));
					}
					else {
						return userSnapshot.ref.update(updatedUserData);
					}
				})
				.then((arguments) => {
			res.json({
				message: "Edit user profile",
						updatedUserData
					});
				})
				.catch((fsError) => {
					next(fsError);
			});
		}
	}


};