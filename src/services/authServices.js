const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
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
  new JwtStrategy(opts, (token, done) => {
    try {
      done(null, token);
    } catch (error) {
      done(error);
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

/**
 * This is demo strategy for third party authentication from Google OAuth. (If application doesn't need it please delete this comment.)
 * To use such authentication developer needs to install appropriate npm package for that third party application. 
 * 
 * passport.use(
  new GoogleStrategy(
    {
      callbackURL,
      clientID,
      clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = {
          providerInfo: {
            id: profile.id,
            name: profile.provider,
          },
          name: profile.displayName,
          email: profile.emails[0].value,
        };
        done(null, user);
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);
 */
