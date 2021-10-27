'use strict';

const base64 = require('base-64');
// const jwt = require('jsonwebtoken');
const { user } = require('../models/index.js')
const SECRET = process.env.SECRET || 'secretstringfortesting';

async function basicAuth(req, res, next) {
  if(!req.headers.authorization) {
    return _authError();
  }
  let basic = req.headers.authorization;
  console.log(basic, 'THIS IS BASIC FROM BASIC.JS');
  let [username, pass] = base64.decode(basic).split(':');
  try{
    req.user = await user.authenticateBasic(username, pass);
    next();
  } catch (error){
    res.status(403).send('Invalid login');
  }
}

// module.exports = async (req, res, next) => {

//   if (!req.headers.authorization) { return _authError(); }

//   let basic = req.headers.authorization;
//   console.log(basic, 'THIS IS BASIC FROM BASIC.JS');
//   let [username, pass] = base64.decode(basic).split(':');

//   try {
//     req.user = await user.authenticateBasic(username, pass)
//     next();
//   } catch (e) {
//     res.status(403).send('Invalid Login');
//   }

// }

module.exports = basicAuth;