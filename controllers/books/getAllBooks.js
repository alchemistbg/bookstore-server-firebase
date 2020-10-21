const { firestore } = require('../../database/database');

const { customError, booksErrors } = require('../../utils/errors');

module.exports = (req, res, next) => {
    const { currPage = '0', pageSize = '6', sortBooks = "true", sortBy = 'addedAt', sortDirection = 'desc' } = req.query;
    const books = [];

    let totalBooks = -1;
    const basicBooksRequest = firestore.collection('/books').select('title', 'author', 'price');
    basicBooksRequest.get().then((basicResults) => {
        totalBooks = basicResults.docs.length;
        console.log(totalBooks)
        // if (totalBooks === 0) {
        // 	return res.status(200).json({
        // 		message: "Bookstore is Empty"
        // 	});
        // }
    }).catch((fsError) => {
        console.log(fsError)
    });

    let offset = +currPage * +pageSize;
    let complexBooksRequest = basicBooksRequest.orderBy(sortBy, sortDirection).offset(offset).limit(+pageSize);
    // if (sortBooks === "true") {
    // 	// booksRequest = firestore.collection('/books').select('title', 'author', 'price').orderBy(sortBy, sortDirection).startAfter((+currPage - 1) * pageSize);
    // } else {
    // 	booksRequest = firestore.collection('/books').select('title', 'author', 'price');
    // }

    complexBooksRequest.get()
        .then((booksCollection) => {
            if (booksCollection.size === 0) {
                // console.log("FUCK")
                return res.status(200).json({
                    message: "Bookstore is Empty"
                });
            }
            booksCollection.forEach((book) => {
                books.push(book.data())
            });
            //This returns array
            // return res.status(200).json(books);
            // This returns object that holds array
            return res.status(200).json({
                totalBooks: totalBooks,
                pageSize: +pageSize,
                pageTotal: Math.ceil(totalBooks / pageSize),
                currPage: +currPage,
                books: [...books]
            });
        })
        .catch((fsError) => {
            console.log(fsError);
            next(fsError);
        });
    // res.send("All books!");
}