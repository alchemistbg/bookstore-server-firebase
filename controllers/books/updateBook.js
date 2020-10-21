const { firestore } = require('../../database/database');

const { customError, booksErrors, usersErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { isbn } = req.body;
    let updatedBook = {};
    console.log(req.user.role)
    if (req.user.role !== 'admin') {
        next(new customError(usersErrors.userUnauthorized));
    } else {
        firestore.doc(`/books/${isbn}`).get()
            .then((bookSnapshot) => {
                if (!bookSnapshot.exists) {
                    next(new customError(booksErrors.bookNotFound));
                } else {
                    updatedBook = {
                        ...req.body,
                        updatedAt: new Date().toISOString()
                    };
                    return firestore.doc(`/books/${isbn}`).update(updatedBook);
                }
            })
            .then(() => {
                res.status(201).json({
                    message: 'Book updated successfully',
                    book: updatedBook
                });
            })
            .catch((fsError) => {
                fsError.status = fsError.status || 400;
                console.log(fsError);
                next(fsError);
            });
    };
}