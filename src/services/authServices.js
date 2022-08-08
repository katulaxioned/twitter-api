const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const {
  secret,
  expireIn,
  algorithm
} = require('../config/config').jwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.algorithms = [algorithm, 'HS256'];
opts.secretOrKey = secret;
passport.use(
  new JwtStrategy(opts, async (token, done) => {
    try {
      const isUserExists = await User.find({ username: token.username });
      if (!isUserExists.length) {
        return done(null, false);
      }
        return done(null, isUserExists);
    } catch (error) {
      return done(error);
    }
  })
);

/**
 * @name createToken
 * @param {Object} data - Object containing data which needs to be stored in token
 * @description Returns signed JWT token which can be given to client
 */
exports.createToken = (data) => {
  try {
    if (data === Object(data)) {
      return jwt.sign(data, secret, {
        algorithm: algorithm,
        expiresIn: expireIn,
      });
    } else {
      return new Error('Given data is not object.');
    }
  } catch (error) {
    return error;
  }
};
