const { firebaseAdmin, firestore, firebase } = require('../../database/database');

const { customError, booksErrors, likesErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { isbn } = req.params;
    console.log(req.user)
    const { username } = req.user;

    let bookData;
    const bookDocument = firestore.doc(`/books/${isbn}`);
    const likeDocument = firestore.collection(`likes`).where("username", "==", username).where("bookId", "==", isbn);

    bookDocument.get()
        .then((bookSnapshot) => {
            if (!bookSnapshot.exists) {
                next(new customError(booksErrors.bookNotFound));
            } else {
                bookData = bookSnapshot.data();
                return likeDocument.get();
            }
        })
        .then((likeQuery) => {
            if (likeQuery.empty) {
                next(new customError(likesErrors.likeNotFound));
            } else {
                const likeId = likeQuery.docs[0].id;
                return firestore.doc(`/likes/${likeId}`).delete()
            }
        })
        .then(() => {
            let bookLikesCount = bookData.likes;
            bookLikesCount = bookLikesCount - 1;
            return bookDocument.update({ likes: bookLikesCount });
        })
        .then(() => {
            // The response is not sended to the client because of the status code
            console.log(`You successfully disliked book ${isbn}`);
            res.status(204).json({
                message: `You successfully disliked book ${isbn}`
            });
        })
        .catch((fsError) => {
            fsError.status = fsError.status || 400;
            console.log(fsError);
            next(fsError);
        });

}