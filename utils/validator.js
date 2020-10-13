const { check } = require('express-validator');
// const { firestore } = require('../database/database');
// const error = require('../utils/errors/error');
// const userMessages = require('../utils/errors/userErrors');

function loginDataValidator() {
    return [
        check('userName')
            .isLength({ min: 5, max: 20 }).withMessage('Username must be between 5 and 20 characters long!')
            .isAlphanumeric().withMessage('Username must contains only latin letters and digits!'),
        check('password')
            .isLength({ min: 8 }).withMessage('Password must at least 8 symbols long!')
            .isAlphanumeric().withMessage('Password must contains only latin letters and digits!')
    ]
}

function registrationDataValidator() {
    return [
        check('username')
            .isLength({ min: 5, max: 20 }).withMessage('Username must be between 5 and 20 characters long!')
            .isAlphanumeric().withMessage('Username must contains only latin letters and digits!'),
        // .custom((username, { req }, next) => {
        //     firestore.doc(`users/${username}`).get()
        //         .then((userSnapshot) => {
        //             if (userSnapshot.exists) {
        //                 throw new Error(`BLAHHHHH`);
        //             } else {
        //                 return userSnapshot;
        //             }
        //         })
        //         .catch((fsError) => {
        //             // console.log(fsError)
        //             // next(fsError);
        //             // next(new error(userMessages.userUsernameInUse));
        //         })
        // }),
        check('email')
            .isEmail().withMessage('Email must be a valid email address!'),
        check('password')
            .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 symbols long!')
            .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)^[A-Za-z0-9]+$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter and one number')
            // .isAlphanumeric().withMessage('Password must contains only latin letters and digits!')
            .custom((password, { req }) => {
                if (req.body.repeatPassword.length < 8) {
                    throw new Error(`Repeat password field can't be empty!`);
                }
                if (password !== req.body.repeatPassword) {
                    throw new Error(`Password and Repeat-Password don't match! ${password} vs. ${req.body.repeatPassword}`);
                } else {
                    return password;
                }
            }),
    ];
}

module.exports = {
    registrationDataValidator,
    loginDataValidator
}