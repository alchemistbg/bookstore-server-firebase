const errorName = 'Comment error';

module.exports = {

    // template: {
    //     name: '',
    //     status: 0,
    //     code: '',
    //     message:''
    // },

    commentNotFound: {
        name: errorName,
        status: 404,
        code: 'comment/comment-not-found',
        message: 'Comment not found!'
    }
}