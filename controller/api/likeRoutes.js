// Imports express router, the auth middelware and the like model
const router = require('express').Router();
const { json } = require('sequelize');
const { Like } = require('../../models');
const auth = require('../../utils/auth');

// Route to create likes
router.post('/',auth, async (req, res) => {
    try {
        // Creates a new like if it does not exists already 
        const [like, created] = await Like.findOrCreate({
            where: { post_id: req.body.post_id, user_id: req.session.user_id }
        })
        if (created) {
            res.status(200).json(like);
            return;
        }
        res.status(400).json({ message: 'Post already liked' });
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/',auth, async (req, res) => {
    try {
        // Deletes the like if it exists
        const unlike = await Like.destroy({
            where: { post_id: req.body.post_id, user_id: req.session.user_id }
        })
        if (unlike) {
            res.status(200).json(unlike);
            return;
        } else {
        res.status(400).json({ message: 'Post not liked yet' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
})



// Exports the routes
module.exports = router;