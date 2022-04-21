const fs = require('fs');

const cors = require('cors');
const express = require('express');

const setupServer = require('./setupServer');

const app = express();

app.use(cors());
setupServer(app);

if (fs.existsSync('build-editor')) {
  app.use('/editor', express.static('build-editor'));
}

app.listen(3000);
