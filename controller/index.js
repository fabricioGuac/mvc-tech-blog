const router = require('express').Router();
const home = require('./homeRoutes');
const api = require('./api');

router.use('/', home);
router.use('/api', api);

module.exports = router;