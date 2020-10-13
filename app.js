const express = require('express');
const app = express();

const userRouter = require('./api/users');
const bookRouter = require('./api/books');

app.use(express.json());
app.set('query parser', 'simple');

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

app.use((error, req, res, next) => {
	// console.log(error);
	// console.log(error.message);
	const status = error.status || 500;
	const { name, code, message } = error;
	res.status(status).json({ name, status, code, message });
	next();
})

app.listen(3001, () => {
	console.log('App listening on port 3001!');
});