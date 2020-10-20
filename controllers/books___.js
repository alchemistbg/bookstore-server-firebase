const { firebaseAdmin, firestore, firebase } = require('../database/database');
const { customError, booksErrors, usersErrors, commentsErrors } = require('../utils/errors');
// const booksErrors = require('../utils/errors/bookErrors');
// const usersErrors = require('../utils/errors/userErrors');
// const commentsErrors = require('../utils/errors/commentErrors');

module.exports = {
	// getAllBooks: (req, res, next) => {
	// 	const { currPage = '0', pageSize = '6', sortBooks = "true", sortBy = 'addedAt', sortDirection = 'desc' } = req.query;
	// 	const books = [];

	// 	let totalBooks = -1;
	// 	const basicBooksRequest = firestore.collection('/books').select('title', 'author', 'price');
	// 	basicBooksRequest.get().then((basicResults) => {
	// 		totalBooks = basicResults.docs.length;
	// 		console.log(totalBooks)
	// 		// if (totalBooks === 0) {
	// 		// 	return res.status(200).json({
	// 		// 		message: "Bookstore is Empty"
	// 		// 	});
	// 		// }
	// 	}).catch((fsError) => {
	// 		console.log(fsError)
	// 	});

	// 	let offset = +currPage * +pageSize;
	// 	let complexBooksRequest = basicBooksRequest.orderBy(sortBy, sortDirection).offset(offset).limit(+pageSize);
	// 	// if (sortBooks === "true") {
	// 	// 	// booksRequest = firestore.collection('/books').select('title', 'author', 'price').orderBy(sortBy, sortDirection).startAfter((+currPage - 1) * pageSize);
	// 	// } else {
	// 	// 	booksRequest = firestore.collection('/books').select('title', 'author', 'price');
	// 	// }

	// 	complexBooksRequest.get()
	// 		.then((booksCollection) => {
	// 			if (booksCollection.size === 0) {
	// 				// console.log("FUCK")
	// 				return res.status(200).json({
	// 					message: "Bookstore is Empty"
	// 				});
	// 			}
	// 			booksCollection.forEach((book) => {
	// 				books.push(book.data())
	// 			});
	// 			//This returns array
	// 			// return res.status(200).json(books);
	// 			// This returns object that holds array
	// 			return res.status(200).json({
	// 				totalBooks: totalBooks,
	// 				pageSize: +pageSize,
	// 				pageTotal: Math.ceil(totalBooks / pageSize),
	// 				currPage: +currPage,
	// 				books: [...books]
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			console.log(error)
	// 		});
	// 	// res.send("All books!");
	// },

	// postBook: (req, res, next) => {
	// 	const { isbn } = req.body;
	// 	let newBook = {};

	// 	if (req.user.role !== 'admin') {
	// 		next(new error(userMessages.unauthorized));
	// 	} else {
	// 		firestore.doc(`/books/${isbn}`).get()
	// 			.then((bookSnapshot) => {
	// 				if (bookSnapshot.exists) {
	// 					next(new error(bookMessages.bookExists));
	// 				} else {
	// 					newBook = {
	// 						...req.body,
	// 						addedAt: new Date().toISOString(),
	// 						updatedAt: new Date().toISOString()
	// 					};
	// 					return firestore.doc(`/books/${isbn}`).set(newBook);
	// 				}
	// 			})
	// 			.then(() => {
	// 				res.status(201).json({
	// 					message: 'Book created successfully',
	// 					book: newBook
	// 				});
	// 			})
	// 			.catch((fsError) => {
	// 				fsError.status = fsError.status || 400;
	// 				next(fsError);
	// 			});
	// 	}
	// },

	// getBook: (req, res, next) => {
	// 	const isbn = req.params.isbn;
	// 	const bookInfo = {};
	// 	const { sortDirection } = req.query || "desc";
	// 	const { sortBy } = req.query;

	// 	firestore.doc(`/books/${isbn}`).get()
	// 		.then((bookSnapshot) => {
	// 			if (!bookSnapshot.exists) {
	// 				next(new error(bookMessages.bookNotFound));
	// 			} else {
	// 				bookInfo.data = bookSnapshot.data();
	// 				return firestore.collection("comments").where('bookId', '==', isbn).orderBy(sortBy, sortDirection).get();
	// 			}
	// 		})
	// 		.then((comments) => {
	// 			bookInfo.comments = [];
	// 			comments.forEach((comment) => {
	// 				bookInfo.comments.push(comment.data());
	// 			});
	// 			res.status(200).json(bookInfo);
	// 		})
	// 		.catch((fsError) => {
	// 			next(fsError)
	// 		});
	// },

	// updateBook: (req, res, next) => {
	// 	const { isbn } = req.body;
	// 	let updatedBook = {};

	// 	if (req.user.role !== 'admin') {
	// 		next(new error(userMessages.unauthorized));
	// 	} else {
	// 		firestore.doc(`/books/${isbn}`).get()
	// 			.then((bookSnapshot) => {
	// 				if (!bookSnapshot.exists) {
	// 					next(new error(bookMessages.bookNotFound));
	// 				} else {
	// 					updatedBook = {
	// 						...req.body,
	// 						updatedAt: new Date().toISOString()
	// 					};
	// 					return firestore.doc(`/books/${isbn}`).update(updatedBook);
	// 				}
	// 			})
	// 			.then(() => {
	// 				res.status(201).json({
	// 					message: 'Book created successfully',
	// 					book: updatedBook
	// 				});
	// 			})
	// 			.catch((fsError) => {
	// 				fsError.status = fsError.status || 400;
	// 				next(fsError);
	// 			});
	// 	};
	// },

	// deleteBook: (req, res, next) => {
	// 	const isbn = req.params.isbn;

	// 	if (req.user.role !== 'admin') {
	// 		next(new error(userMessages.unauthorized));
	// 	} else {
	// 		firestore.doc(`/books/${isbn}`).get()
	// 			.then((bookSnapshot) => {
	// 				if (!bookSnapshot.exists) {
	// 					next(new error(bookMessages.bookNotFound));
	// 				} else {
	// 					return bookSnapshot.ref.delete();
	// 				}
	// 			}).then(() => {
	// 				console.log(`Book with ${isbn} deleted!`);
	// 				// The response is not sended to the client because of the status code
	// 				res.status(204).json({
	// 					message: `Book with ${isbn} deleted!`
	// 				});
	// 			})
	// 			.catch((fsError) => {
	// 				next(fsError);
	// 			});
	// 	}
	// },

	// postComment: (req, res, next) => {
	// 	const { isbn } = req.params;
	// 	const { username } = req.user;
	// 	const { commentText } = req.body;

	// 	let commentId;
	// 	const newComment = {};

	// 	firestore.doc(`/books/${isbn}`).get()
	// 		.then((bookSnapshot) => {
	// 			if (!bookSnapshot.exists) {
	// 				next(new customError(booksErrors.bookNotFound));
	// 			} else {
	// 				newComment.username = username;
	// 				newComment.bookId = isbn;
	// 				newComment.bookTitle = bookSnapshot.data().title;
	// 				newComment.commentText = commentText;
	// 				newComment.createdAt = new Date().toISOString();

	// 				let bookCommentsCount = bookSnapshot.data().comments;
	// 				bookCommentsCount = bookCommentsCount + 1;
	// 				return bookSnapshot.ref.update({ comments: bookCommentsCount });
	// 			};
	// 		})
	// 		.then(() => {
	// 			return firestore.collection(`comments`).add(newComment);
	// 		})
	// 		.then(() => {
	// 			res.status(201).json({
	// 				message: `Comment created successfully.`,
	// 				newComment
	// 			});
	// 		})
	// 		.catch((fsError) => {
	// 			next(fsError);
	// 		});
	// },

	// getComments: (req, res, next) => {
	// 	const { isbn } = req.params;
	// 	let bookComments = {};

	// 	firestore.collection('comments').where('bookId', '==', isbn).get()
	// 		.then((comments) => {
	// 			comments.forEach((comment) => {
	// 				// console.log(comment.id, comment.data());
	// 				bookComments[comment.id] = comment.data();
	// 			});
	// 			res.status(200).json(bookComments);
	// 		})
	// 		.catch((fsError) => {
	// 			next(fsError);
	// 		});
	// },

	// deleteComments: (req, res, next) => {

	// 	if (req.user.role === 'admin') {
	// 		next(new customError(usersErrors.unauthorized));
	// 	} else {
	// 		const { isbn, commentId } = req.params;
	// 		firestore.doc(`comments/${commentId}`).get()
	// 			.then((commentSnapshot) => {
	// 				if (!commentSnapshot.exists) {
	// 					next(new customError(commentsErrors.commentNotFound));
	// 				} else {
	// 					return commentSnapshot.ref.delete();
	// 				}
	// 			})
	// 			.then(() => {
	// 				return firestore.doc(`books/${isbn}`).get();
	// 			})
	// 			.then((bookSnapshot) => {
	// 				if (!bookSnapshot.exists) {
	// 					next(new customError(booksErrors.bookNotFound));
	// 				} else {
	// 					let bookCommentsCount = bookSnapshot.data().comments;
	// 					bookCommentsCount = bookCommentsCount - 1;
	// 					return bookSnapshot.ref.update({ comments: bookCommentsCount });
	// 				}
	// 			})
	// 			.then(() => {
	// 				// The response is not sended to the client because of the status code
	// 				console.log(`Comment with id ${commentId} deleted successfully!`);
	// 				res.status(204).json({
	// 					message: `Comment with id ${commentId} deleted successfully!`
	// 				});
	// 			})
	// 			.catch((fsError) => {
	// 				next(fsError);
	// 			});
	// 	}
	// },

	// getLikes: (req, res, next) => {
	// 	const { isbn } = req.params;
	// 	const { username } = req.user;

	// 	firestore.collection(`likes`).where('username', '==', username).orderBy('createdAt', 'desc').get()
	// 		.then((likesQuery) => {
	// 			console.log(likesQuery.data())
	// 			if (!likesQuery.length === 0) {
	// 				const error = new error("Invalid data");
	// 				error.status = 404;
	// 				error.code = "book/book-not-found";
	// 				error.message = "Book not found";
	// 				throw error;
	// 			} else {
	// 				res.status(200).json({
	// 					likes: likesQuery
	// 				});
	// 			}
	// 		})
	// 		.catch((fsError) => {
	// 			next(fsError);
	// 		});
	// 	// res.json({
	// 	// 	message: `${isbn} liked by ${username}!`
	// 	// });
	// },

	// postLike: (req, res, next) => {
	// 	const { isbn } = req.params;
	// 	const { username } = req.user;

	// 	const newLike = {
	// 		username: username,
	// 		bookId: isbn,
	// 		createdAt: new Date().toISOString(),
	// 	};

	// 	let bookData;
	// 	const bookDocument = firestore.doc(`/books/${isbn}`);
	// 	const likeDocument = firestore.collection("likes").where("username", "==", username).where("bookId", "==", isbn);

	// 	bookDocument.get()
	// 		.then((bookSnapshot) => {
	// 			if (!bookSnapshot.exists) {
	// 				next(new customError(booksErrors.bookNotFound));
	// 			} else {
	// 				newLike.bookTitle = bookSnapshot.data().title;
	// 				bookData = bookSnapshot.data();
	// 				return likeDocument.get();
	// 			}
	// 		})
	// 		.then((likeQuery) => {
	// 			if (!likeQuery.empty) {
	// 				return res.status(400).json({
	// 					message: "You have already liked this book"
	// 				});
	// 			}
	// 			else {
	// 				return firestore.collection("likes").add(newLike)
	// 					.then(() => {
	// 						let bookLikesCount = bookData.likes;
	// 						bookLikesCount = bookLikesCount + 1;
	// 						return bookDocument.update({ likes: bookLikesCount });
	// 					})
	// 					.then(() => {
	// 						res.status(201).json({
	// 							message: "Like created successfully.",
	// 							newLike
	// 						});
	// 					})
	// 			}
	// 		})
	// 		.catch((fbError) => {
	// 			console.error(fbError)
	// 		});
	// },

	// deleteLike: (req, res, next) => {
	// 	const { isbn } = req.params;
	// 	console.log(req.user)
	// 	const { username } = req.user;

	// 	let bookData;
	// 	const bookDocument = firestore.doc(`/books/${isbn}`);
	// 	const likeDocument = firestore.collection(`likes`).where("username", "==", username).where("bookId", "==", isbn);

	// 	bookDocument.get()
	// 		.then((bookSnapshot) => {
	// 			if (!bookSnapshot.exists) {

	// 			} else {
	// 				bookData = bookSnapshot.data();
	// 				return likeDocument.get();
	// 			}
	// 		})
	// 		.then((likeQuery) => {
	// 			if (likeQuery.empty) {

	// 			} else {
	// 				const likeId = likeQuery.docs[0].id;

	// 				return firestore.doc(`/likes/${likeId}`).delete()

	// 			}
	// 		})
	// 		.then(() => {
	// 			let bookLikesCount = bookData.likes;
	// 			bookLikesCount = bookLikesCount - 1;
	// 			return bookDocument.update({ likes: bookLikesCount });
	// 		})
	// 		.then(() => {
	// 			// The response is not sended to the client because of the status code
	// 			console.log(`You successfully disliked book ${isbn}`);
	// 			res.status(204).json({
	// 				message: `You successfully disliked book ${isbn}`
	// 			});
	// 		})
	// 		.catch((fbError) => {
	// 			console.log(fbError)
	// 		});

	// }
}