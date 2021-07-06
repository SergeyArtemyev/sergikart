const express = require('express');
const getLogsData = require('./CloudWatch/getPaymentsLog');

const app = express();

app.use(express.json({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/', () => {
    console.log('ok');
});

app.get('/post', (req, res) => {
    console.log(req.params);
    res.json('ok');
});

app.listen({ port: 8000 }, () => {
    console.log('Server is running');
});
