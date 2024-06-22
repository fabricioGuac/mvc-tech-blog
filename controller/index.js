// Requires express and the routes
const router = require('express').Router();
const home = require('./homeRoutes');
const api = require('./api');

// Sets the routes
router.use('/', home);
router.use('/api', api);

// Exports the routes
module.exports = router;