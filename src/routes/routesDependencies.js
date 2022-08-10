exports.default = {
  // List Controllers
  serverHealth: require('../controllers/serverHealth'),
  authClient: require('../controllers/authController'),
  userClient: require('../controllers/userController'),
  tweetClient: require('../controllers/tweetController'),
  timelineClient: require('../controllers/timelineController'),
};
