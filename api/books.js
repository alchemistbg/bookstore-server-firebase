const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const commentsController = require('../controllers/comments');
const likesController = require('../controllers/likes');
const auth = require('../utils/auth');

router.get('/', booksController.getAllBooks);

//CRUD operations on book
router.post('/', auth, booksController.postBook);
router.get('/:isbn', booksController.getBook);
router.patch('/:isbn', auth, booksController.updateBook);
router.delete('/:isbn', auth, booksController.deleteBook);

// CRUD operations on comments
router.post('/:isbn/comments', auth, commentsController.postComment);
router.get('/:isbn/comments', commentsController.getComments);
router.delete('/:isbn/comment/:commentId', auth, commentsController.deleteComment);

// CRUD operations on favorites - TODO?
// router.post('/:isbn/favorites', booksController.likeBook);

// CRUD operations on likes
router.post('/:isbn/likes', auth, likesController.postLike);
// This route shows books liked by user, so it should be moved in user-related routes?!
router.get('/:isbn/likes', auth, likesController.getBookLikes);
router.delete('/:isbn/likes', auth, likesController.deleteLike);

module.exports = router;