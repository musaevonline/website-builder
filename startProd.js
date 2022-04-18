const express = require('express');

const setupServer = require('./server');

const app = express();

setupServer(app);
app.listen(3000);
