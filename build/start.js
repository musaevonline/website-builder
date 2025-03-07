const fs = require('fs');

const express = require('express');

const setupServer = require('./setupServer');

const app = express();

setupServer(app);

if (fs.existsSync('editor')) {
  app.use('/editor', express.static('editor'));
  app.use('/editor/*', express.static('editor'));
}

app.listen(3000);
