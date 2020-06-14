const express = require('express');
const app = express();

const userRouter = require('./api/users');

app.use(express.json());

app.use('/api/user', userRouter);

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});