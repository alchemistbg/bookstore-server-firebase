const { firebaseAdmin, firestore, firebase } = require('../../database/database');

const validator = require('../../utils/validator');

const { customErrors, usersErrors } = require('../../utils/errors');

function register(req, res, next) {
    if (validator.validateUserInfo(req, res, next)) {
        const newUser = { ...req.body };
        let userId, token;
        firestore.doc(`/users/${newUser.username}`).get()
            .then((userSnapshot) => {
                if (userSnapshot.exists) {
                    next(new customErrors(usersErrors.userUsernameInUse));
                } else {
                    return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                }
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            })
            .then((userData) => {
                userId = userData.user.uid;
                return userData.user.getIdToken();
            })
            .then((idToken) => {
                token = idToken;
                const newUserData = {
                    userId: userId,
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
            .then(() => {
                res.status(201).json({
                    token
                });
            })
            .catch((fsError) => {
                fsError.status = fsError.status || 400;
                next(fsError);
            });
    }
}

module.exports = register;