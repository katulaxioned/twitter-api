const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');
const Joi = require('joi');

const Tweet = require('../models/tweet');
const mongoose = require('mongoose');

const options = { abortEarly : false };

const createTweetSchema = Joi.object({
   title: Joi.string().min(2).max(80).required(),
   description: Joi.string().min(2).max(400).required(),
});
/**
 * @description Returns the new created tweet.
 * @function createTweet
 */
exports.createTweet = async (req, res) => {
   try {
      const { title, description } = req.body;
      const validationResult = utils.validateProvidedData(createTweetSchema, req.body, options);
      if (validationResult) {
         return res.status(400).send(utils.responseMsg(validationResult));
      }
      const newTweet = new Tweet({
         title: title,
         description: description,
         createdBy: req.user[0].id
      })

      await newTweet.save(err => {
         if (err) return res.status(500).send(utils.responseMsg(errorMsg.dbError));
      })
      return res.status(200).send(utils.responseMsg(null, true, newTweet));
   } catch (err) {
      return res.status(500).send(utils.responseMsg(err));
   }
}

/**
 * @description Returns the tweets that created by logged in user.
 * @function getAllTweets
 */
 exports.getAllTweets = async (req, res) => {
   try {
      const result = await Tweet.find({ createdBy: req.user[0].id });
      if (!result.length) {
         return res.status(200).send(utils.responseMsg(null, true, "You don't created any tweets."));
      }
      return res.status(200).send(utils.responseMsg(null, true, result));
   } catch (err) {
      return res.status(500).send(utils.responseMsg(err));
   }
}

const updateTweetSchema = Joi.object({
   title: Joi.string().min(2).max(80),
   description: Joi.string().min(2).max(400),
});
/**
 * @description Returns the new updated tweet.
 * @function updateTweet
 */
 exports.updateTweet = async (req, res) => {
   try {
      const { id } = req.params;
      // For update only title and description is allowed.
      // Validation for title, description.
      const validationResult = utils.validateProvidedData(updateTweetSchema, req.body, options);
      if (validationResult) {
         return res.status(400).send(utils.responseMsg(validationResult));
      }
      // Validation for query params id.
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
         return res.status(400).send(utils.responseMsg(errorMsg.idNotValid));
      }
      // Validation for valid tweet id.
      const oldTweet = await Tweet.find({ _id: id });
      if (!oldTweet.length) {
         return res.status(404).send(utils.responseMsg(errorMsg.tweetNotFound));
      }
      // Validation for checking tweet belongs to creator or not.
      if (!(oldTweet[0].createdBy.equals(req.user[0].id))){
         return res.status(403).send(utils.responseMsg(errorMsg.noTweetUpdate));
      }

      const updatedTweet = await Tweet.findOneAndUpdate({ _id: id }, req.body, {
         new: true,
         runValidators: true,
      })
      return res.status(200).send(utils.responseMsg(null, true, updatedTweet));
   } catch (err) {
      return res.status(500).send(utils.responseMsg(err));
   }
}

/**
 * @description Delete the tweet and return the success response.
 * @function deleteTweet
 */
exports.deleteTweet = async (req, res) => {
   try {
      const { id } = req.params;
      // Validation for query params id.
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
         return res.status(400).send(utils.responseMsg(errorMsg.idNotValid));
      }
      // Validation for valid tweet id.
      const foundedTweet = await Tweet.find({ _id: id });
      if (!foundedTweet.length) {
         return res.status(404).send(utils.responseMsg(errorMsg.tweetNotFound));
      }
      // Validation for checking tweet belongs to creator or not.
      if (!(foundedTweet[0].createdBy.equals(req.user[0].id))){
         return res.status(403).send(utils.responseMsg(errorMsg.noTweetDelete));
      }

      const result = await Tweet.deleteOne({ _id: id });
      if (result.deletedCount) {
         return res.status(200).send(utils.responseMsg(null, true, "Tweet deleted successfully"));
      }
      return res.status(500).send(utils.responseMsg(errorMsg.dbError));
   } catch (err) {
      return res.status(500).send(utils.responseMsg(err));
   }
}

/**
 * @description Liked the tweet and send success response.
 * @function likeTheTweet
 */
exports.likeTweetToggle = async (req, res) => {
   try {
      const { id } = req.params;
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
         return res.status(400).send(utils.responseMsg(errorMsg.idNotValid));
      }
      const tweet = await Tweet.find({ _id: id });
      if (!tweet.length) {
         return res.status(404).send(utils.responseMsg(errorMsg.tweetNotFound));
      }
      if (tweet[0].likes.includes(req.user[0].id)) {
         // Unlike the tweet.
         const userLikeIndex = tweet[0].likes.indexOf(req.user[0].id);
         if (userLikeIndex > -1) {
            tweet[0].likes.splice(userLikeIndex, 1);
         }
         tweet[0].likeCount--;
         tweet[0].save({ timestamps: false }, err => {
            if (err) return res.status(500).send(utils.responseMsg(errorMsg.dbError));
         });
         return res.status(200).send(utils.responseMsg(null, true, "Tweet unlike."));
      }
      //  Like the tweet.
      tweet[0].likes.push(req.user[0].id);
      tweet[0].likeCount++;
      tweet[0].save({ timestamps: false }, err => {
         if (err) return res.status(500).send(utils.responseMsg(errorMsg.dbError));
      });
      return res.status(200).send(utils.responseMsg(null, true, "Tweet liked successfully."))      
   } catch (err) {
      return res.status(500).send(utils.responseMsg(err));
   }
}

atul = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjMzMzZjNGNmYTY1M2M1NmEzN2U1YSIsInVzZXJuYW1lIjoia2F0dWxheGlvbmVkIiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNjYwMTA1NjY0LCJleHAiOjE2NjAxOTIwNjR9.pCmosmdfI0tCb2nMg0bh-yfhGoMcos4wKH32LcvK2Q0'
sachin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjMzMzRiNGNmYTY1M2M1NmEzN2U1NyIsInVzZXJuYW1lIjoic2FjaGluIiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNjYwMTA1NjIyLCJleHAiOjE2NjAxOTIwMjJ9.c-NqLPGf911LC4GZOcwL3jx8wtuIOHsJTgzE5TeYOt0'
akshay = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjMzMzA5NGNmYTY1M2M1NmEzN2U1NCIsInVzZXJuYW1lIjoiYWtzaGF5IiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNjYwMTA1NTg3LCJleHAiOjE2NjAxOTE5ODd9.UCkjvxasJg_w8rxkTl2DsKtgAzMDTs9YjsbI91RaXbI'
testing = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjM0ODg2YjQwNTA3ZjdlMDE1NzE2ZCIsInVzZXJuYW1lIjoidGVzdGluZyIsImlhdCI6MTY2MDExMTIwNiwiZXhwIjoxNjYwMTk3NjA2fQ.vJ2kaEQU9eSivxZmydpcz8ZjpAjh85nE2zRdDLA6Nls'