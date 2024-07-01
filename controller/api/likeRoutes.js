// Imports express router, the auth middelware and the like model
const router = require('express').Router();
const {Like} = require('../../models');
const auth = require('../../utils/auth');

// Route to create likes
router.post('/',auth,async (req, res) => {
    try {
        // Creates a new like with the body content and the session user id as the user id
        const like = await Like.create({
        ...req.body,
        user_id:req.session.user_id
    })
        res.status(200).json(like);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Exports the routes
module.exports = router;