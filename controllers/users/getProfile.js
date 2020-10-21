const { firestore } = require('../../database/database');

module.exports = (req, res, next) => {
    //TODO: check if user exists
    if ((Object.keys(req.user).length === 0) || (req.user.username !== req.params.username)) {
        firestore.doc(`users/${req.params.username}`).get()
            .then((userSnapshot) => {
                const { role, registeredAt, userId, ...userData } = userSnapshot.data();
                return res.status(200).json({
                    message: "Public profile",
                    userData
                });
            })
            .catch((fsError) => {
                console.log(fsError);
                fsError.status = fsError.status || 400;
                next(fsError);
            });
    } else {
        const commentsOrderDirection = req.query.commentsDort || "desc";
        const likesOrderDirection = req.query.likesDort || "desc";

        const userProfile = {
            ...req.user,
            comments: [],
            likes: []
        };

        firestore.collection(`comments`).where('username', '==', req.user.username).orderBy('createdAt', commentsOrderDirection).get()
            .then((commentsQuery) => {
                commentsQuery.forEach((comment) => {
                    userProfile.comments.push(comment.data());
                });
                return firestore.collection("likes").where("username", "==", req.user.username).orderBy("createdAt", likesOrderDirection).get();
            })
            .then((likesQuery) => {
                likesQuery.forEach((like) => {
                    userProfile.likes.push(like.data());
                });
                res.status(200).json({
                    message: "Private profile",
                    userProfile
                });
            })
            .catch((fsError) => {
                console.log(fsError);
                fsError.status = fsError.status || 400;
                next(fsError);
            });
    }
}