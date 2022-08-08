const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');
const Joi = require('joi');

const User = require('../models/user');

/**
 * @description Returns logged user profile details.
 * @function userProfile
 */
exports.userProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send(utils.responseMsg(errorMsg.unauthorized));
        }
        const profile = await User.find({ username: req.user[0].username });
        res.status(200).send(utils.responseMsg(null, true, profile));
    } catch (err) {
    console.error('error', err.stack);
    return res
      .status(500)
      .send(utils.responseMsg(err));
    }
}