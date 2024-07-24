// Imports express router, the auth middelware and the message model
const router = require('express').Router();
const {Message} = require('../../models');
const auth = require('../../utils/auth');


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


// Exports the routes
module.exports = router;