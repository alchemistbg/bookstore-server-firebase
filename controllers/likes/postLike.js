const { firebaseAdmin, firestore, firebase } = require('../../database/database');

const { customError, booksErrors, usersErrors, commentsErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { isbn } = req.params;
    const { username } = req.user;

    const newLike = {
        username: username,
        bookId: isbn,
        createdAt: new Date().toISOString(),
    };

    let bookData;
    const bookDocument = firestore.doc(`/books/${isbn}`);
    const likeDocument = firestore.collection("likes").where("username", "==", username).where("bookId", "==", isbn);

    bookDocument.get()
        .then((bookSnapshot) => {
            if (!bookSnapshot.exists) {
                next(new customError(booksErrors.bookNotFound));
            } else {
                newLike.bookTitle = bookSnapshot.data().title;
                bookData = bookSnapshot.data();
                likeDocument.get()
                    .then((likeQuery) => {
                        if (!likeQuery.empty) {
                            return res.status(400).json({
                                message: "You have already liked this book"
                            });
                        }
                        else {
                            return firestore.collection("likes").add(newLike)
                                .then(() => {
                                    let bookLikesCount = bookData.likes;
                                    bookLikesCount = bookLikesCount + 1;
                                    return bookDocument.update({ likes: bookLikesCount });
                                })
                                .then(() => {
                                    res.status(201).json({
                                        message: "Like created successfully.",
                                        newLike
                                    });
                                })
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