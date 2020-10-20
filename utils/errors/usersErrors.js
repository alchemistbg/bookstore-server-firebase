const errorName = 'User error';

module.exports = {

    // template: {
    //     name: '',
    //     status: 0,
    //     code: '',
    //     message:''
    // },

    userUsernameInUse: {
        name: errorName,
        status: 400,
        code: 'auth/username-already-in-use',
        message: 'The username is already in use!'
    },

    userUnauthenticated: {
        name: errorName,
        status: 401,
        code: 'user/user-unauthenticated',
        message: 'User is not authenticated!'
    },

    userUnauthorized: {
        name: errorName,
        status: 403,
        code: 'user/user-unauthorized',
        message: 'User is not authorized!'
    },

    userInvalidToken: {
        name: errorName,
        status: 403,
        code: 'auth/user-invalid-token',
        message: 'Error while verifying token'
    },

    userUsernameNotFound: {
        name: errorName,
        status: 404,
        code: 'user/user-unknown-username',
        message: 'Could not find the username!'
    },

    userRegistrationError: {
        name: errorName,
        status: 422,
        code: 'user/user-invalid-registration-data',
        message: ''
    }
}