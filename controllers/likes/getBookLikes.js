const { firebaseAdmin, firestore, firebase } = require('../../database/database');

const { customError, booksErrors, usersErrors, commentsErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { isbn } = req.params;

    if (req.user.role !== 'admin') {
        next(new customError(usersErrors.userUnauthorized));
    } else {
        firestore.doc(`books/${isbn}`).get()
            .then((bookSnapshot) => {
                if (!bookSnapshot.exists) {
                    next(new customError(booksErrors.bookNotFound));
                } else {
                    firestore.collection(`likes`).where('bookId', '==', isbn).orderBy('createdAt', 'desc').get()
                        .then((likesQuery) => {
                            if (likesQuery.docs.length === 0) {
                                console.log("FUCK")
                                res.status(200).json({
                                    message: 'This is not been liked yet!!'
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
                }
            })

            .catch((fsError) => {
                fsError.status = fsError.status || 400;
                console.log(fsError);
                next(fsError);
            });
    }
}