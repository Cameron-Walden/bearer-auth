'use strict';

const bcrypt = require('bcrypt');
//adding in json webtoken
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secretstringfortesting';

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      //https://sequelize.org/master/class/lib/data-types.js~VIRTUAL.html
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      }
    }
  });

  model.beforeCreate(async (user) => {
    let hashedPass =  await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    console.log(username, password, 'THIS IS USERNAME AND PASSWORD');

    const user = await this.findOne({where: { username }});
    console.log(user, 'THIS IS USER')

    const valid = await bcrypt.compare(password, user.password)
    if (valid) { return user; }
    throw new Error('Invalid User');
  }

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);

      //adds in await for async function
      const user = await this.findOne({ where: { username: parsedToken.username }});
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  }
  return model;
}

module.exports = userSchema;