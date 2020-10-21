const { firestore } = require('../../database/database');

const { customError, booksErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const isbn = req.params.isbn;

    if (req.user.role !== 'admin') {
        next(new error(userMessages.unauthorized));
    } else {
        firestore.doc(`/books/${isbn}`).get()
            .then((bookSnapshot) => {
                if (!bookSnapshot.exists) {
                    next(new customError(booksErrors.bookNotFound));
                } else {
                    return bookSnapshot.ref.delete();
                }
            }).then(() => {
                console.log(`Book with ${isbn} deleted!`);
                // The response is not sended to the client because of the status code
                res.status(204).json({
                    message: `Book with ${isbn} deleted!`
                });
            })
            .catch((fsError) => {
                next(fsError);
            });
    }
}