const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

router.get("/", dependencies.userClient.getProfile);
router.patch("/update", dependencies.userClient.updateProfile);
router.delete("/delete", dependencies.userClient.deleteProfile);

module.exports = router;