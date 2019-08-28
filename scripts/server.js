/* eslint-disable */
const express = require('express');
const PORT = process.env.PORT || 8088;

const server = express();

server.use(express.static(__dirname + '/../dist'));

server.get('/*', (req, res, next) => {
  res.send(require('fs').readFileSync(__dirname + '/../dist/index.html', { encoding: 'utf8' }));
});

server.listen(PORT);
