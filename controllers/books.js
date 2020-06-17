module.exports = {
	getAllBooks: (req, res, next) => {
		res.send("All books!");
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
		const bookId = req.params.bookId;
		res.send(`${bookId} details!`);
	},

	updateBook: (req, res, next) => {

	},

	deleteBook: (req, res, next) => {

	}
}