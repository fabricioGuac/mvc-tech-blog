const router = require('express').Router();
const user = require('./userRoutes');
const post = require('./postRoutes');

router.use('/user',user);
router.use('/post', post);

module.exports = router