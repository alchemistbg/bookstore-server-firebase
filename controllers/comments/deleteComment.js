const { firestore } = require('../../database/database');

const { customError, usersErrors, commentsErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {

    if (req.user.role !== 'admin') {
        next(new customError(usersErrors.userUnauthorized));
    } else {
        const { isbn, commentId } = req.params;
        firestore.doc(`comments/${commentId}`).get()
            .then((commentSnapshot) => {
                if (!commentSnapshot.exists) {
                    next(new customError(commentsErrors.commentNotFound));
                } else {
                    return commentSnapshot.ref.delete();
                }
            })
            .then(() => {
                return firestore.doc(`books/${isbn}`).get();
            })
            .then((bookSnapshot) => {
                if (!bookSnapshot.exists) {
                    next(new customError(booksErrors.bookNotFound));
                } else {
                    let bookCommentsCount = bookSnapshot.data().comments;
                    bookCommentsCount = bookCommentsCount - 1;
                    return bookSnapshot.ref.update({ comments: bookCommentsCount });
                }
            })
            .then(() => {
                // The response is not sended to the client because of the status code
                console.log(`Comment with id ${commentId} deleted successfully!`);
                res.status(204).json({
                    message: `Comment with id ${commentId} deleted successfully!`
                });
            })
            .catch((fsError) => {
                console.log(fsError);
                next(fsError);
            });
    }
}