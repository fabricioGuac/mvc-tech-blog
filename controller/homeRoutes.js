// Imports the router, models, sequelize and auth middleware
const router = require('express').Router();
const { Post, User, Comment, Like, Message } = require('../models');
const auth = require('../utils/auth');
const sequelize = require('../config/connection')
const {Op} = require('sequelize');

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


// Route to get all users to chat with and display the latest chats at the top
router.get('/messages', auth, async (req, res) => {
    try {
        // Gets the current user id
        const currentUserId = req.session.user_id;

        // Gets all users
        const allUsers = await User.findAll();
        // Converts the user objects to plain JavaScript objects for easier manipulation.
        const allUsersData = allUsers.map(user => user.get({ plain: true }));

        // Gets all messages where the current user is either the sender or the receiver ordered by descending date
        const recentChats = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: currentUserId },
                    { receiver_id: currentUserId }
                ],
            },
            attributes: ['sender_id', 'receiver_id', 'date'],
            order: [['date', 'DESC']],
        });

        // Create a map to store the most recent date for each user pair
        const recentChatDates = {};
        recentChats.forEach(chat => {
            // Determines the other user involved in the chat
            const otherUserId = chat.sender_id === currentUserId ? chat.receiver_id : chat.sender_id;
            /// Store the date of the first occurrence (most recent due to ordering) 
            if (!recentChatDates[otherUserId]) {
                recentChatDates[otherUserId] = chat.date;
            }
        });

        // Separates users who have had recent chats with the current user
        const recentChatUsers = allUsersData.filter(user => recentChatDates[user.id]);

        // Sorts recent chat users by their most recent chat date in descending order
        recentChatUsers.sort((a, b) => new Date(recentChatDates[b.id]) - new Date(recentChatDates[a.id]));

        // Separates users who have not had recent chats with the current user
        const otherUsers = allUsersData.filter(user => !recentChatDates[user.id]);

        // Combines recent chat users and other users
        const userChatsData = [...recentChatUsers, ...otherUsers];

        res.status(200).render('chatOptions', {
            userChatsData,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Function to get the chat between two users
router.get('/messages/:id',  auth, async (req, res) =>{

    //Deconstructs the id of the target user
    const {id} = req.params;

    // Gets the id of the current logged in user
    const currentUserId = req.session.user_id;

    try {
        // Retrieves all messages where the sender and receiver are either the target user and the current user, or vice versa
        const messages = await Message.findAll({
            where:{
                [Op.or]: [
                    {sender_id: id, receiver_id: currentUserId},
                    {sender_id: currentUserId , receiver_id: id },
                ],
            },
            // Orders them in ascending order
            order: [['date', 'ASC']],
                // Joins with the user table on the username for the sender and receiver
                include: [
                    {
                        model: User,
                        as: 'Sender',
                        attributes: ['username'],
                    },
                    {
                        model: User,
                        as: 'Receiver',
                        attributes: ['username'],
                    },
                ],
        });

        const chat = messages.map(message => message.get({ plain: true }));


        res.status(200).render('chat',{
            chat,
            logged_in: req.session.logged_in,
            currentUserId: currentUserId
        });
    } catch (err) {
        res.status(500).json(err);
    }
})


// Exports the routes
module.exports = router;