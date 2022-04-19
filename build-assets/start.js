const fs = require('fs');

const express = require('express');

const setupServer = require('./setupServer');

const app = express();

setupServer(app);

if (fs.existsSync('public')) {
  app.use('/editor', express.static('public'));
}

app.listen(3000);
