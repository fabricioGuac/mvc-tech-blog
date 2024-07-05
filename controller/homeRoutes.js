// Imports the router, models, sequelize and auth middleware
const router = require('express').Router();
const { Post, User, Comment, Like } = require('../models');
const auth = require('../utils/auth');
const sequelize = require('../config/connection')

// Route to get the posts and render the homepage handlebars template
router.get('/', async (req, res) => {
    try {
        // Reads the posts from the post table
        const AllPost = await Post.findAll({
            // Joins with the user table on the username
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
            // Orders them by publication date
            order: [['date', 'DESC']],
        });

        // Parses the data so that handlebars can use it 
        const posts = AllPost.map((post) => post.get({ plain: true }));

        // Renders the homepage handlebars template, passing the post information and the logged in status
        res.status(200).render('homepage', {
            posts,
            logged_in: req.session.logged_in
        })
    } catch (err) {
        res.status(500).json(err);
    }
})

// Route to render the sign up handlebars template
router.get('/signup', (req, res) => {
    // If the user is logged in redirects them to the homepage
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }
    // Renders the sign up handlebars template
    res.status(200).render('signUp');
})

// Route to render the log in handlebars template
router.get('/login', (req, res) => {
    // If the user is logged in redirects them to the homepage
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }
    // Renders log in handlebars template
    res.status(200).render('login');
})

// Route to get the user posts and render the dashboard handlebars template
router.get('/dashboard', auth, async (req, res) => {
    try {
        // Reads the posts from the post table that match the user id
        const uPost = await Post.findAll({
            where: { user_id: req.session.user_id },
            // Joins with the user table on the username
            include: [{
                model: User,
                attributes: ['username'],
            }],
            // Orders them by publication date
            order: [['date', 'DESC']],
        });
        // Parses the data so that handlebars can use it 
        const posts = uPost.map((post) => post.get({ plain: true }));
        // Renders the dashboard handlebars template, passing the post information and the logged in status
        res.status(200).render('dashboard', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

// Route to render the new post handlebars template
router.get('/newPost', auth, (req, res) => {
    res.status(200).render('newPost');
})


// Route to render the individual post
router.get('/blog/:id', async (req, res) => {
    try {
         // Reads from the post table the post that matches the primary key
        const readPost = await Post.findByPk(req.params.id, {
            // Uses sequelize literal to count the comments and likes for the target post
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comment
                            WHERE comment.post_id = post.id
                        )`),
                        'commentCount'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM "like"
                            WHERE "like".post_id = post.id
                        )`),
                        'likeCount'
                    ]
                ]
            },
            // Joins with the user table on the username
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });


        // Checks if the user is logged in
        let liked = null;
        if(req.session.user_id){
        // Checks if the post has already been liked by the user
        liked = await Like.findOne({ where: {post_id: req.params.id, user_id: req.session.user_id}});
        }
        
        // If no post matches the target id sents a not found status and error
        if (!readPost) {
            res.status(404).json({ message: "No post found with this id" });
        }

        // Parses the data so that handlebars can use it 
        const post = readPost.get({ plain: true });

        // Renders the read handlebars template, passing the post information and the logged in status
        res.status(200).render('read', {
            post,
            logged_in: req.session.logged_in,
            liked: liked !== null,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to get the post to edit and render the editor handlebars template
router.get('/editor/:id', auth, async (req, res) => {
    try {
        // Reads from the post table the posts that matches the primary key and the user id matches the current user id
        const edPost = await Post.findByPk(req.params.id, {
            where: {
                user_id: req.session.user_id
            },
        });

        // If the post is not found sents a not found status and error message
        if (!edPost) {
            res.status(404).json({ message: "No post found with this id" });
        }

        // Parses the data so that handlebars can use it 
        const post = edPost.get({ plain: true });
        // Renders the editor handlebars template, passing the post information and the logged in status
        res.status(200).render('editor', {
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to get a post comment and render the comments handlebars template
router.get('/comments/:id', auth, async (req, res) => {
    try {
        // Reads from the comment table all comments that belong to the target post
        const comm = await Comment.findAll({
            where: { post_id: req.params.id },
            // Joins with the user table on the username
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        });

        // Parses the data so that handlebars can use it 
        const comms = comm.map(comment => comment.get({ plain: true }));
        // Renders the comments handlebars template, passing the comments information, the post id  and the logged in status
        res.status(200).render('comments', {
            comms,
            post_id: req.params.id,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Exports the routes
module.exports = router;