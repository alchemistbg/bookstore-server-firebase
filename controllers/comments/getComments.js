const { firestore } = require('../../database/database');

const { customError, commentsErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { isbn } = req.params;
    let bookComments = {};

    firestore.collection('comments').where('bookId', '==', isbn).get()
        .then((comments) => {
            comments.forEach((comment) => {
                // console.log(comment.id, comment.data());
                bookComments[comment.id] = comment.data();
            });
            res.status(200).json(bookComments);
        })
        .catch((fsError) => {
            console.log(fsError);
            next(fsError);
        });
}