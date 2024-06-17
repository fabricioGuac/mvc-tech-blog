const router = require('express').Router();
const user = require('./userRoutes');

router.use('/user',user);

module.exports = router