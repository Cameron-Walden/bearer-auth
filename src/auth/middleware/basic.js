'use strict';

const base64 = require('base-64');
// const jwt = require('jsonwebtoken');
const { users } = require('../models/index.js')
const SECRET = process.env.SECRET || 'secretstringfortesting';

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ');
  console.log(basic, 'THIS IS BASIC FROM BASIC.JS');
  let encodedString = basic.pop();
  let decodedString = base64.decode(encodedString);
  let [username, pass] = decodedString.split(':');

  try {
    req.user = await user.authenticateBasic(username, pass)
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}
