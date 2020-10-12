const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');
const auth = require('../utils/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/:username', auth, userController.getProfile);
router.patch('/:username', auth, userController.updateProfile);

module.exports = router;
