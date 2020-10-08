const firebaseAdminConfig = require('./adminConfig.json');
const firebaseBasicConfig = require('./basicConfig.json');

const firebaseAdmin = require('firebase-admin');
exports.firebaseAdmin = firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(firebaseAdminConfig),
	databaseURL: "https://react-firebase-e95ce.firebaseio.com"
});

exports.firestore = firebaseAdmin.firestore();

const fb = require('firebase');
exports.firebase = fb.initializeApp(firebaseBasicConfig);