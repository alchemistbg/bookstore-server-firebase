const express = require('express');
const app = express();

const userRouter = require('./api/users');
const bookRouter = require('./api/books');

app.use(express.json());
app.set('query parser', 'simple');


app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

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