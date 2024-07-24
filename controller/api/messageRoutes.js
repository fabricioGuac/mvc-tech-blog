// Imports express router, the auth middelware and the message model
const router = require('express').Router();
const {Message, User} = require('../../models');
const auth = require('../../utils/auth');
const {Op} = require('sequelize')


// Function to create a mesage 
router.post('/',auth, async (req, res) => {
    // Deconstructs the receiver id the message content from the body
    const {receiver_id, content} = req.body;

    // Gets the sender id from the session user id
    const sender_id = req.session.user_id;
    try {
        // Creates a new message
        const newMessage =  await Message.create({receiver_id, sender_id, content});

        res.status(200).json(newMessage);
    } catch (err) {
        res.status(500).json(err)
    }
});


// Function to get the chat between two users
router.get('/:id',  auth, async (req, res) =>{

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