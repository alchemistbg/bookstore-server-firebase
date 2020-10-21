const { firestore } = require('../../database/database');

const { customError, booksErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    //TODO: add check if user is logged in
    const { isbn } = req.params;
    const { username } = req.user;
    const { commentText } = req.body;

    let commentId;
    const newComment = {};

    firestore.doc(`/books/${isbn}`).get()
        .then((bookSnapshot) => {
            if (!bookSnapshot.exists) {
                next(new customError(booksErrors.bookNotFound));
            } else {
                newComment.username = username;
                newComment.bookId = isbn;
                newComment.bookTitle = bookSnapshot.data().title;
                newComment.commentText = commentText;
                newComment.createdAt = new Date().toISOString();

                let bookCommentsCount = bookSnapshot.data().comments;
                bookCommentsCount = bookCommentsCount + 1;
                bookSnapshot.ref.update({ comments: bookCommentsCount })
                    .then(() => {
                        return firestore.collection(`comments`).add(newComment);
                    })
                    .then(() => {
                        res.status(201).json({
                            message: `Comment created successfully.`,
                            newComment
                        });
                    })
            };
        })
        .catch((fsError) => {
            console.log(fsError);
            fsError.status = fsError.status || 400;
            next(fsError);
        });
}