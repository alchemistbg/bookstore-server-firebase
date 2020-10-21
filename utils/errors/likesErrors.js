const errorName = 'Like error';

module.exports = {

    // template: {
    //     name: '',
    //     status: 0,
    //     code: '',
    //     message:''
    // },

    // bookExists: {
    //     name: errorName,
    //     status: 400,
    //     code: 'book/isbn-already-in-use',
    //     message: 'Book with this ISBN already exists!'
    // },

    likeNotFound: {
        name: errorName,
        status: 404,
        code: 'like/like-not-found',
        message: 'Like not found!'
    }
}