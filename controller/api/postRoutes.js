const router = require('express').Router();
const {Post} = require('../../models');
const auth = require('../../utils/auth');

router.post('/',auth,async (req, res) => {
    try {
        const post = await Post.create({
        ...req.body,
        user_id:req.session.user_id
    })
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;
