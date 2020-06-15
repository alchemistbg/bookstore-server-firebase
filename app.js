const express = require('express');
const app = express();

const userRouter = require('./api/users');
const bookRouter = require('./api/books');

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/book', bookRouter);

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.status || 500;
	const { code, message } = error;
	res.status(status).json({ code, message });
	next();
})

app.listen(3000, () => {
	console.log('App listening on port 3000!');
});