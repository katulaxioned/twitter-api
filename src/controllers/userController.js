const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const options = { abortEarly : false };

/**
 * @description Returns logged in user profile details.
 * @function getProfile
 */
exports.getProfile = async (req, res) => {
    try {
        const profile = await User.find({ username: req.user[0].username });
        profile.forEach(pro => {
            pro.password = undefined;
        })
        res.status(200).send(utils.responseMsg(null, true, profile));
    } catch (err) {
    console.error('error', err.stack);
    return res
      .status(500)
      .send(utils.responseMsg(err));
    }
}

const updateProfileSchema = Joi.object({
    username: Joi.string().alphanum(),
    email: Joi.string().email(),
    password: Joi.string().min(4).max(18),
    info: Joi.string().max(400)
  });

/**
 * @description Updated the user and returns the response.
 * @function updateProfile
 */
 exports.updateProfile = async (req, res) => {
    try {
        const validationResult = utils.validateProvidedData(updateProfileSchema, req.body, options);
        if (validationResult) {
            return res.status(400).send(utils.responseMsg(validationResult));
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12);
        }
        const updatedUser = await User.findOneAndUpdate({ _id: req.user[0].id}, req.body, {
            new: true,
            runValidators: true,
        })
        if (!updatedUser) {
            return res
              .status(500)
              .send(utils.responseMsg(errorMsg.dbError));
          }
        return res.status(200).send(utils.responseMsg(null, true, updatedUser));
    } catch (err) {
        console.error('error', err.stack);
        return res.status(500).send(utils.responseMsg(err));
    }
}

/**
 * @description Delete the user and returns the success message.
 * @function deleteProfile
 */
 exports.deleteProfile = async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.user[0].id });
        if (result.deletedCount) {
            return res.status(200).send(utils.responseMsg(null, true, "Profile deleted successfully"));
        }
        return res
        .status(500)
        .send(utils.responseMsg(errorMsg.dbError));
    } catch (err) {
        console.error('error', err.stack);
        return res.status(500).send(utils.responseMsg(err));
    }
 }