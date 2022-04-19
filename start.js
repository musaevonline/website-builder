const fs = require('fs');

const express = require('express');

const setupServer = require('./setupServer');

const app = express();

setupServer(app);

if (fs.existsSync('build-editor')) {
  app.use('/editor', express.static('build-editor'));
}

app.listen(3000);
