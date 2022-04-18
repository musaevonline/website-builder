const express = require('express');

const setupServer = (app) => {
  app.use('/', express.static('website'));
};

module.exports = setupServer;
