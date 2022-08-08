const authService = require('../services/authServices');
const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');
const Joi = require('joi');

const User = require('../models/user');

const options = { abortEarly : false };

const logInSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(4).max(18).required(),
});

/**
 * @description Local login controller.
 * @function login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = { username, password };
    const validationResult = utils.validateProvidedData(logInSchema, data, options);
    if (validationResult) {
      return res.status(400).send(utils.responseMsg(validationResult));
    }

    const validUser = await User.findOne({ username: username });

    if (!validUser) {
      return res.status(422).send(utils.responseMsg(errorMsg.noUserExist));
    }

    if (validUser.password === password) {
      let message = {
        msg: 'Login Successful.',
        token: authService.createToken({
          username,
          password,
        }),
      };
      return res.status(200).send(utils.responseMsg(null, true, message));
    }

    return res
      .status(401)
      .send(utils.responseMsg(utils.responseMsg(errorMsg.wrongPassword)));
    //Please replace dummy payload with your actual object for creating token.
  } catch (error) {
    console.error('error', error.stack);
    return res
      .status(500)
      .send(utils.responseMsg(error));
  }
};

const signUpSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(18).required(),
	info: Joi.string().max(400)
});


/**
 * @description Local signup controller.
 * @function signup
 */
exports.signup = async (req, res) => {
	try {
    const { username, email, password, info } = req.body;
		
    const data = { username, email, password, info};
    const validationResult = utils.validateProvidedData(signUpSchema, data, options);
    if (validationResult) {
      return res.status(400).send(utils.responseMsg(validationResult));
    }

    const result = await User.findOne({ username: username });
    // check for user exists or not.
    if (result) {
      return res
        .status(409)
        .send(utils.responseMsg(errorMsg.duplicateUserProvided));
    }
    const newUser = new User({
      username: username,
      email: email,
      password: password,
      info: info,
    });
    await newUser.save((err) => {
      if (err)
        return res
          .status(500)
          .send(utils.responseMsg(errorMsg.dbError));
    });
    return res.status(200).send(utils.responseMsg(null, true, newUser));
  } catch (error) {
    console.error('error', error.stack);
    return res
      .status(500)
      .send(utils.responseMsg(error));
  }
}