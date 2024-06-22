// Imports express router, the auth middelware and the comment model
const router = require('express').Router();
const {Comment} = require('../../models');
const auth = require('../../utils/auth');

// Route to create comments
router.post('/',auth,async (req, res) => {
    try {
        // Creates a new comment with the body content and the session user id as the user id
        const comment = await Comment.create({
        ...req.body,
        user_id:req.session.user_id
    })
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Exports the routes
module.exports = router;