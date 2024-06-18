const router = require('express').Router();
const {Post,User} = require('../models');
const auth = require('../utils/auth');

router.get('/',async (req, res) => {
    try {
        const AllPost = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        });
        const posts = AllPost.map((post) => post.get({plain:true}));
        console.log(posts,"home")

        res.status(200).render('homepage', { 
            posts,
            logged_in: req.session.logged_in 
        })
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }
    res.status(200).render('signUp');
})

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }
    res.status(200).render('login');
})

router.get('/dashboard',auth, async (req, res) => {
    try {
        const uPost = await Post.findAll({
            where: { user_id: req.session.user_id },
            include: [{
                model: User,
                attributes: ['username'],
            }]
        });
        const posts = uPost.map((post) => post.get({plain:true}));
        console.log(posts,"dashboard")
        res.status(200).render('dashboard', { 
            posts,
            logged_in: req.session.logged_in 
        });
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;