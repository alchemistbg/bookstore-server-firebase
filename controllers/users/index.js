const register = require('./register');
const login = require('./login');
const getProfile = require('./getProfile');
const updateProfile = require('./updateProfile');
const getUserComments = require('./getUserComments');
const getUserLikes = require('./getUserLikes');

module.exports = {
	register,
	login,
	getProfile,
	updateProfile,
	getUserComments,
	getUserLikes
}