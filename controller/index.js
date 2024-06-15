const router = require('express').Router();
const home = require('./homeRoutes');

router.use('/', home);

module.exports = router;