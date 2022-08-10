const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

router.get("/", dependencies.timelineClient.getTweets);
router.get("/:id", dependencies.timelineClient.getSingleTweet);

module.exports = router;