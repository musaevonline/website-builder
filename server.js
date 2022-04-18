const express = require('express');
const glob = require('glob');

const setupServer = (app) => {
  app.use('/', express.static('website'));
  app.get('/editor/pages', (req, res) => {
    const pages = glob
      .sync('website/*.html')
      .map((page) => page.replace('website/', ''));

    return res.send(JSON.stringify(pages));
  });
};

module.exports = setupServer;
