const express = require('express');
const router = express.Router();

const validator = require('../utils/validator');

const userController = require('../controllers/users');
const auth = require('../utils/auth');

router.post('/register', validator.registrationDataValidator(), userController.register);
router.post('/login', validator.loginDataValidator(), userController.login);

router.get('/:username', auth, userController.getProfile);
router.patch('/:username', auth, userController.updateProfile);

router.get('/:username/comments', auth, userController.getUserComments);
router.get('/:username/likes', auth, userController.getUserLikes);

module.exports = router;
