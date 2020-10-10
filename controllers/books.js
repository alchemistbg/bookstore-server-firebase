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

	postBook: (req, res, next) => {
		const { isbn } = req.body;
		let newBook = {};

		if (req.user.role !== 'admin') {
			next(new error(userMessages.unauthorized));
					} else {
			firestore.doc(`/books/${isbn}`).get()
				.then((bookSnapshot) => {
					if (bookSnapshot.exists) {
						next(new error(bookMessages.bookExists));
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
		const { isbn } = req.body;
		let updatedBook = {};

		if (req.user.role !== 'admin') {
			next(new error(userMessages.unauthorized));
		} else {
			firestore.doc(`/books/${isbn}`).get()
				.then((bookSnapshot) => {
					if (!bookSnapshot.exists) {
						next(new error(bookMessages.bookNotFound));
					} else {
						updatedBook = {
							...req.body,
							updatedAt: new Date().toISOString()
						};
						return firestore.doc(`/books/${isbn}`).update(updatedBook);
					}
				})
				.then(() => {
					res.status(201).json({
						message: 'Book created successfully',
						book: updatedBook
		});
				})
				.catch((fsError) => {
					fsError.status = fsError.status || 400;
					next(fsError);
				});
		};
	},

	deleteBook: (req, res, next) => {
		const isbn = req.params.isbn;

		if (req.user.role !== 'admin') {
			next(new error(userMessages.unauthorized));
		} else {
			firestore.doc(`/books/${isbn}`).get()
				.then((bookSnapshot) => {
					if (!bookSnapshot.exists) {
						next(new error(bookMessages.bookNotFound));
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
	},
	postComment: (req, res, next) => {
		const { isbn } = req.params;
		const { username } = req.user;
		const { commentText } = req.body;

		let commentId;
		const newComment = {};

		firestore.doc(`/books/${isbn}`).get()
			.then((bookSnapshot) => {
				if (!bookSnapshot.exists) {
					next(new error(bookMessages.bookNotFound));
				} else {
					newComment.username = username;
					newComment.bookId = isbn;
					newComment.bookTitle = bookSnapshot.data().title;
					newComment.commentText = commentText;
					newComment.createdAt = new Date().toISOString();

					let bookCommentsCount = bookSnapshot.data().comments;
					bookCommentsCount = bookCommentsCount + 1;
					return bookSnapshot.ref.update({ comments: bookCommentsCount });
				};
			})
			.then(() => {
				return firestore.collection(`comments`).add(newComment);
			})
			.then(() => {
				res.status(201).json({
					message: `Comment created successfully.`,
					newComment
				});
			})
			.catch((fsError) => {
				next(fsError);
			});
	},

	getComments: (req, res, next) => {
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
				next(fsError);
			});
	},

	deleteComments: (req, res, next) => {

		if (req.user.role === 'admin') {
			next(new error(userMessages.unauthorized));
		} else {
			const { isbn, commentId } = req.params;
			firestore.doc(`comments/${commentId}`).get()
				.then((commentSnapshot) => {
					if (!commentSnapshot.exists) {
						next(new error(commentMessages.commentNotFound));
					} else {
						return commentSnapshot.ref.delete();
					}
				})
				.then(() => {
					return firestore.doc(`books/${isbn}`).get();
				})
				.then((bookSnapshot) => {
					if (!bookSnapshot.exists) {
						next(new error(bookMessages.bookNotFound));
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
					next(fsError);
				});
		}
	},
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