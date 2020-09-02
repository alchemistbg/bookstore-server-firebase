const { firebaseAdmin, firestore, firebase } = require('../database/database');

module.exports = {
	getAllBooks: (req, res, next) => {
		const books = [];
		firestore.collection('/books').select('title', 'author', 'price').get()
			.then((booksCollection) => {
				// console.log(booksCollection.size)
				if (booksCollection.size === 0) {
					return res.status(200).json({
						message: "Bookstore is Empty"
					});
				}
				console.log(booksCollection)
				booksCollection.forEach((book) => {
					books.push(book.data())
				});
				// console.log(books);
				//This returns array
				// return res.status(200).json(books);
				// This returns object that holds array
				return res.status(200).json({
					size: books.length,
					books: [...books]
				});
			})
			.catch((error) => {
				console.log(error)
			});
		// res.send("All books!");
	},

	addBook: (req, res, next) => {
		// console.log(req.user)
		if (req.user.role === 'admin') {
			const newBook = { ...req.body };
			firestore.doc(`/books/${newBook.isbn}`).get()
				.then((book) => {
					if (book.exists) {
						const error = new Error("Invalid data");
						error.status = 400;
						error.code = "book/isbn-already-in-use";
						error.message = "Book with this ISBN already exists!";
						throw error;
					} else {
						return firestore.doc(`/books/${newBook.isbn}`).set(newBook)
					}
				})
				.then(() => {
					res.status(201).json({
						message: 'OK'
					});
				})
				.catch((fbError) => {
					fbError.status = fbError.status || 400;
					next(fbError);
				});
		} else {
			return res.status(403).json({
				message: "Unauthorized"
			});
		}
	},

	getBook: (req, res, next) => {
		const isbn = req.params.isbn;
		const bookInfo = {};
		// console.log(req.query);
		const { orderDirection } = req.query || "desc";
		firestore.doc(`/books/${isbn}`).get()
			.then((bookSnapshot) => {
				if (!bookSnapshot.exists) {
					const error = new Error("Invalid data");
					error.status = 404;
					error.code = "book/book-not-found";
					error.message = "Book not found";
					throw error;
				} else {
					bookInfo.data = bookSnapshot.data();
					return firestore.collection("comments").where('bookId', '==', isbn).orderBy("createdAt", orderDirection).get();
				}
			})
			.then((comments) => {
				bookInfo.comments = [];
				comments.forEach((comment) => {
					bookInfo.comments.push(comment.data());
					// console.log(comment.data());
				});
				res.status(200).json(bookInfo);
			})
			.catch((fsError) => {
				fsError.status = fsError.status || 400;
				next(fsError)
			});
	},

	updateBook: (req, res, next) => {
		const bookId = req.params.bookId;
		res.json({
			message: `${bookId} updated!`
		});
	},

	deleteBook: (req, res, next) => {
		if (req.user.role === 'admin') {
			const isbn = req.params.isbn;
			firestore.doc(`/books/${isbn}`).delete()
				.then(() => {
					console.log("DELETED")
					res.status(204).json({
						message: `${isbn} deleted!`
					});
				})
				.catch((fbError) => {
					next(fbError);
				});
		} else {
			res.status(403).json({
				message: "Unauthorized"
			});
		}
	},
		});
	},

	commentBook: (req, res, next) => {
		const bookId = req.params.bookId;
		res.json({
			message: `${bookId} commented!`
		});

	},

	likeBook: (req, res, next) => {
		const bookId = req.params.bookId;
		res.json({
			message: `${bookId} liked!`
		});

	}
}