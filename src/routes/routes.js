const router = require('express').Router();
const tweetRoutes = require('./tweetRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const timelineRoutes = require('./timelineRoutes');
const passport = require('passport');
const dependencies = require('./routesDependencies').default;


router.get('/health', dependencies.serverHealth.checkHealth);

router.use('/tweet', passport.authenticate('jwt', { session : false }), tweetRoutes);
router.use('/user', passport.authenticate('jwt', { session : false }), userRoutes);
router.use('/timeline', timelineRoutes);
router.use('/auth', authRoutes);

module.exports = router;
