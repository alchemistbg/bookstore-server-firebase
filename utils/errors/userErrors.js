// const errorName = 'User error';

module.exports = {

    // template: {
    //     name: '',
    //     status: 0,
    //     code: '',
    //     message:''
    // },

    unauthenticated: {
        name: 'Unauthenticated',
        status: 401,
        code: 'user/user-unauthenticated',
        message: 'User is not authenticated!'
    },

    unauthorized: {
        name: 'Unauthorized',
        status: 403,
        code: 'user/user-unauthorized',
        message: 'User is not authorized!'
    }
}