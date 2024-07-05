// Imports the necessary dependencies for routing
const router = require('express').Router();
const user = require('./userRoutes');
const post = require('./postRoutes');
const comment = require('./commentRoutes');
const like = require('./likeRoutes');

// Sets up the routes 
router.use('/user',user);
router.use('/post', post);
router.use('/comment', comment);
router.use('/like', like);

// Exporst the routes 
module.exports = router