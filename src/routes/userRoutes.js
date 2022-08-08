const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

router.get("/", dependencies.userClient.userProfile);

module.exports = router;