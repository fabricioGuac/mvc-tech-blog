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

router.delete("/:id", async (req, res) => {
    try {
        const delPost = await Post.destroy({
            where:{
                id:req.params.id,
                user_id:req.session.user_id,
            },
        });
        if(!delPost){
            res.status(404).json({message:"No post found with this id"});
        }
        res.status(200).json(delPost);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;
