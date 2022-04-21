const fs = require('fs');

const express = require('express');
const glob = require('glob');

const setupServer = (app) => {
  app.use(express.json());
  app.use('/', express.static('website'));

  app.get('/editor/pages', (req, res) => {
    const pages = glob
      .sync('website/*.html')
      .map((page) => page.replace('website/', ''));

    return res.send(JSON.stringify(pages));
  });

  app.post('/editor/save', (req, res) => {
    const { html } = req.body;

    fs.writeFileSync('website/test.html', html);

    return res.status(200).send();
  });
};

module.exports = setupServer;
