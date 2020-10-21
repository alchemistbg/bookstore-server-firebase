const { firebaseAdmin, firestore, firebase } = require('../../database/database');

const { customError, userMessages } = require('../../utils/errors');

function updateProfile(req, res, next) {
    const updatedUserData = { ...req.body };

    if (req.user.username !== req.params.username) {
        next(new customError(userMessages.userUnauthenticated));
    } else {
        firestore.doc(`users/${req.user.username}`).get()
            .then((userSnapshot) => {
                if (!userSnapshot.exists) {
                    next(new customError(userMessages.userUsernameNotFound));
                }
                else {
                    return userSnapshot.ref.update(updatedUserData);
                }
            })
            .then(() => {
                res.status(200).json({
                    message: "User profile updated successfully",
                    updatedUserData
                });
            })
            .catch((fsError) => {
                console.log(fsError);
                fsError.status = fsError.status || 400;
                next(fsError);
            });
    }
}
module.exports = updateProfile;