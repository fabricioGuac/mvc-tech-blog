// Imports express router, the auth middelware and the user model
const router = require('express').Router();
const {Post} = require('../../models');
const auth = require('../../utils/auth');
const imgVal = require('../../utils/imgVal');

// Route to create a new post
router.post('/',auth,imgVal,async (req, res) => {
    try {
        console.log(req.body)
        // Creates a new post with the body content and the session user id as the user id
        const post = await Post.create({
        ...req.body,
        user_id:req.session.user_id
    })
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Route to update the posts
router.put("/:id", async (req, res) => {
    try {
        // Updates from posts any post that matches the user id from the session and the id from the parameters
        const upPost = await Post.update(req.body,{
            where:{
                id:req.params.id,
                user_id:req.session.user_id,
            },
        });
        // If no post matches any of the requirements returns an error
        if(!upPost){
            res.status(404).json({message:"No post found with this id"});
        }
        res.status(200).json(upPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Route to delete posts
router.delete("/:id", async (req, res) => {
    try {
        // Deletes from posts any post that matches the user id from the session and the id from the parameters
        const delPost = await Post.destroy({
            where:{
                id:req.params.id,
                user_id:req.session.user_id,
            },
        });
        // If no post matches any of the requirements returns an error
        if(!delPost){
            res.status(404).json({message:"No post found with this id"});
        }
        res.status(200).json(delPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Exports the routes
module.exports = router;
