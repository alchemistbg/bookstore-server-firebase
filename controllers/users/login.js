const { firestore, firebase } = require('../../database/database');

const validator = require('../../utils/validator');

const { customError, usersErrors } = require('../../utils/errors');

function login(req, res, next) {

    if (validator.validateUserInfo(req, res, next)) {
        const userData = { ...req.body };

        let user = {};
        let idToken = null;

        if (!userData.loginID.includes("@")) {
            firestore.doc(`/users/${userData.loginID}`).get()
                .then((userSnapshot) => {
                    if (!userSnapshot.exists) {
                        next(new customError(userMessages.userUsernameNotFound));
                    }
                    else {
                        user = { ...userSnapshot.data() }
                        return firebase.auth().signInWithEmailAndPassword(userSnapshot.data().email, userData.password);
                    }
                }).then((userData) => {
                    return userData.user.getIdToken();
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
    }
}

module.exports = login;