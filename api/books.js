const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const auth = require('../utils/auth');

router.get('/', booksController.getAllBooks);

//CRUD operations on book
router.post('/', auth, booksController.addBook);
router.get('/:isbn', booksController.getBook);
router.patch('/:isbn', auth, booksController.updateBook);
router.delete('/:isbn', auth, booksController.deleteBook);

// CRUD operations on comments
router.post('/:isbn/comments', auth, booksController.postComment);
router.get('/:isbn/comments', booksController.getComments);
router.delete('/:isbn/comment/:commentId', auth, booksController.deleteComments);

// CRUD operations on favorites - TODO?
// router.post('/:isbn/favorites', booksController.likeBook);

// CRUD operations on likes
router.post('/:isbn/likes', auth, booksController.postLike);
// This route shows books liked by user, so it should be moved in user-related routes?!
router.get('/:isbn/likes', auth, booksController.getLikes);
router.delete('/:isbn/likes', auth, booksController.deleteLike);

module.exports = router;