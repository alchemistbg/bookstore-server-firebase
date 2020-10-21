const { firestore } = require('../../database/database');

const { customError, userErrors, booksErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { isbn } = req.body;
    let newBook = {};

    if (req.user.role !== 'admin') {
        next(new customError(userErrors.unauthorized));
    } else {
        firestore.doc(`/books/${isbn}`).get()
            .then((bookSnapshot) => {
                if (bookSnapshot.exists) {
                    next(new customError(booksErrors.bookExists));
                } else {
                    newBook = {
                        ...req.body,
                        addedAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    return firestore.doc(`/books/${isbn}`).set(newBook);
                }
            })
            .then(() => {
                res.status(201).json({
                    message: 'Book created successfully',
                    book: newBook
                });
            })
            .catch((fsError) => {
                fsError.status = fsError.status || 400;
                next(fsError);
            });
    }
}