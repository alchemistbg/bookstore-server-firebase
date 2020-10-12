// const errorName = 'User error';

module.exports = {

    // template: {
    //     name: '',
    //     status: 0,
    //     code: '',
    //     message:''
    // },

    userUnauthenticated: {
        name: 'Unauthenticated',
        status: 401,
        code: 'user/user-unauthenticated',
        message: 'User is not authenticated!'
    },

    userUnauthorized: {
        name: 'Unauthorized',
        status: 403,
        code: 'user/user-unauthorized',
        message: 'User is not authorized!'
    },

    userInvalidToken: {
        name: 'Invalid token',
        status: 403,
        code: 'auth/user-invalid-token',
        message: 'Error while verifying token'
    },

    userUsernameInUse: {
        name: 'Invalid username',
        status: 400,
        code: 'auth/username-already-in-use',
        message: 'The username is already in use!'
    }
}