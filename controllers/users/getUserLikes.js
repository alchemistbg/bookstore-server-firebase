const { firebaseAdmin, firestore, firebase } = require('../../database/database');

const { customError, booksErrors, usersErrors, commentsErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { isbn } = req.params;
    const { username } = req.user;

    firestore.collection(`likes`).where('username', '==', username).orderBy('createdAt', 'desc').get()
        .then((likesQuery) => {
            if (likesQuery.docs.length === 0) {
                res.status(200).json({
                    message: 'You have not been sliked any book yet!'
                });
            } else {
                const likes = [];
                likesQuery.docs.map((like) => {
                    likes.push(
                        like.data()
                    );
                });

                res.status(200).json(
                    likes
                );
            }
        })
        .catch((fsError) => {
            fsError.status = fsError.status || 400;
            console.log(fsError);
            next(fsError);
        });
}