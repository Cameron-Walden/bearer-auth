'use strict';

require('dotenv').config();

const server = require('./src/server.js');
const { db } = require('./src/auth/models/index.js');
const PORT = process.env.PORT || 3000;

db.sync().then( () => {
  server.start(PORT);
});