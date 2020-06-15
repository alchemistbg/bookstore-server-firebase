const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const auth = require('../utils/auth');

router.get('/', booksController.getAllBooks);

//CRUD operations on book
router.post('/', auth, booksController.addBook);
router.get('/:bookId', booksController.getBook);
router.patch('/:bookId', auth, booksController.updateBook);
router.delete('/:bookId', auth, booksController.deleteBook);

module.exports = router;