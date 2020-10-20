const errorName = 'Book error';

module.exports = {

    // template: {
    //     name: '',
    //     status: 0,
    //     code: '',
    //     message:''
    // },

    bookExists: {
        name: errorName,
        status: 400,
        code: 'book/isbn-already-in-use',
        message: 'Book with this ISBN already exists!'
    },

    bookNotFound: {
        name: errorName,
        status: 404,
        code: 'book/book-not-found',
        message: 'Book not found!'
    }
}