const fs = require('fs');

const express = require('express');
const glob = require('glob');

const setupServer = (app) => {
  app.use(express.json({ limit: '50MB' }));
  app.use('/', express.static('website'));

  app.get('/editor/pages', (req, res) => {
    const pages = glob
      .sync('website/*.html')
      .map((page) => page.replace('website/', ''));

    return res.send(JSON.stringify(pages));
  });

  app.post('/editor/save', (req, res) => {
    const { html, page } = req.body;

    fs.writeFileSync(`website/${page}`, html);

    return res.status(200).send();
  });
};

module.exports = setupServer;
