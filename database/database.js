const config = require('./config.json');

const firebase = require('firebase');
exports.database = firebase.initializeApp(config);
