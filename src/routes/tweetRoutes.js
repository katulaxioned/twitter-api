const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

router.get('/getall', dependencies.tweetClient.getAllTweets);
router.post('/create', dependencies.tweetClient.createTweet);
router.patch('/update/:id', dependencies.tweetClient.updateTweet);
router.delete('/delete/:id', dependencies.tweetClient.deleteTweet);
router.patch('/like/:id', dependencies.tweetClient.likeTweetToggle);

module.exports = router;
