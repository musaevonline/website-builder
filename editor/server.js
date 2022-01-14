const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express();

app.use('/site', express.static('..'))
app.use(createProxyMiddleware({ target: 'http://localhost:3000' }));

app.listen(3001);