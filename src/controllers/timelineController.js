const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');

const Tweet = require('../models/tweet');
const mongoose = require('mongoose');

/**
 * @description Sort take query inputs latest, oldest, mostliked, and leastliked and return tweets accordingly or if query input not provided then it just return tweets without sorting.
 * @function getTweets
 */
exports.getTweets = async (req, res) => {
    try {
        const { sortfilter } = req.query;
        let tweets;
        switch (sortfilter) {
            case 'latest':
                tweets = await Tweet.find().sort({ updatedAt: -1 });
                break;
            case 'oldest':
                tweets = await Tweet.find().sort({ updatedAt: 1 });
                break;
            case 'mostliked':
                tweets = await Tweet.find().sort({ likeCount: -1 })
                break;
            case 'leastliked':
                tweets = await Tweet.find().sort({ likeCount: 1 })
                break;
            default:
                tweets = await Tweet.find();
                break;
        }
        if (!tweets.length) {
            return res.status(200).send(utils.responseMsg(null, true, "Don't have any tweets."));
        }
        return res.status(200).send(utils.responseMsg(null, true, tweets));
    } catch (err) {
        return res.status(500).send(utils.responseMsg(err));
    }
}

/**
 * @description Returns tweet that matches the provided id.
 * @function getSingleTweet
 */
 exports.getSingleTweet = async (req, res) => {
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
        return res.status(200).send(utils.responseMsg(null, true, tweet));
    } catch (err) {
        return res.status(500).send(utils.responseMsg(err));
    }
}