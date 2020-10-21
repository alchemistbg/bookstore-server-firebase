const { firestore } = require('../../database/database');

const { customError, booksErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const isbn = req.params.isbn;
    const bookInfo = {};
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || 'desc';


    firestore.doc(`/books/${isbn}`).get()
        .then((bookSnapshot) => {
            if (!bookSnapshot.exists) {
                next(new customError(booksErrors.bookNotFound));
            } else {
                bookInfo.data = bookSnapshot.data();
                return firestore.collection("comments").where('bookId', '==', isbn).orderBy(sortBy, sortDirection).get();
            }
        })
        .then((comments) => {
            bookInfo.comments = [];
            comments.forEach((comment) => {
                bookInfo.comments.push(comment.data());
            });
            res.status(200).json(bookInfo);
        })
        .catch((fsError) => {
            next(fsError)
        });
}