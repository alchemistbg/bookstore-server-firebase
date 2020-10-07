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
router.get('/:isbn/comments', booksController.getComments);
router.post('/:isbn/comments', auth, booksController.postComment);
// router.post('/:isbn/favorites', booksController.likeBook);
// CRUD operations on likes
router.get('/:isbn/likes', auth, booksController.getLikes);
router.post('/:isbn/likes', auth, booksController.postLike);
router.delete('/:isbn/likes', auth, booksController.deleteLike);

module.exports = router;