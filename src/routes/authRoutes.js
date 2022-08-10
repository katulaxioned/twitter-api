const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

router.post('/login', dependencies.authClient.login);
router.post('/signup', dependencies.authClient.signup);

module.exports = router;
