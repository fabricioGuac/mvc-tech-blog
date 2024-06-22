// Imports the necessary dependencies for routing
const router = require('express').Router();
const user = require('./userRoutes');
const post = require('./postRoutes');
const comment = require('./commentRoutes');

// Sets up the routes 
router.use('/user',user);
router.use('/post', post);
router.use('/comment', comment);

// Exporst the routes 
module.exports = router