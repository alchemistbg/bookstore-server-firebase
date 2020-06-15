module.exports = {
	getAllBooks: (req, res, next) => {
		res.send("All books!");
	},

	addBook: (req, res, next) => {
		res.send("Add book!");
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