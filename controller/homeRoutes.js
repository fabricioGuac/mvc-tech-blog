const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const auth = require('../utils/auth');
const sequelize = require('../config/connection')

router.get('/', async (req, res) => {
    try {
        const AllPost = await Post.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                                        SELECT COUNT(*)
                                        FROM comment
                                        WHERE comment.post_id = post.id
                                    )`),
                        'commentCount'
                    ]
                ]
            },
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        const posts = AllPost.map((post) => post.get({ plain: true }));

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

router.get('/dashboard', auth, async (req, res) => {
    try {
        const uPost = await Post.findAll({
            where: { user_id: req.session.user_id },
            include: [{
                model: User,
                attributes: ['username'],
            }]
        });
        const posts = uPost.map((post) => post.get({ plain: true }));
        res.status(200).render('dashboard', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/newPost', auth, (req, res) => {
    res.status(200).render('newPost');
})

router.get('/editor/:id', auth, async (req, res) => {
    try {
        const edPost = await Post.findByPk(req.params.id, {
            where: {
                user_id: req.session.user_id
            },
        });
        if (!edPost) {
            res.status(404).json({ message: "No post found with this id" });
        }
        const post = edPost.get({ plain: true });
        res.status(200).render('editor', {
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/comments/:id', auth, async (req, res) => {
    try {
        const comm = await Comment.findAll({
            where: { post_id: req.params.id },
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        });


        const comms = comm.map(comment => comment.get({ plain: true }));
        res.status(200).render('comments', {
            comms,
            post_id: req.params.id,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;