// Imports the necessary dependencies for routing
const router = require('express').Router();
const user = require('./userRoutes');
const post = require('./postRoutes');
const comment = require('./commentRoutes');
const like = require('./likeRoutes');
const message = require('./messageRoutes');

// Sets up the routes 
router.use('/user',user);
router.use('/post', post);
router.use('/comment', comment);
router.use('/like', like);
router.use('/message', message);

// Exporst the routes 
module.exports = router