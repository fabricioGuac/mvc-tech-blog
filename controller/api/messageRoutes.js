// Imports express router, the auth middelware and the message model
const router = require('express').Router();
const {Message} = require('../../models');
const auth = require('../../utils/auth');
const {Op} = require('sequelize')



// auth
router.post('/', async (req, res) => {
    const {receiver_id, content, sender_id} = req.body;

    // const sender_id = req.session.user_id;
    try {

        const newMessage =  await Message.create({receiver_id, sender_id, content});

        res.status(200).json(newMessage);
    } catch (err) {
        res.status(500).json(err)
    }
});


// auth, get

router.post('/:id',  async (req, res) =>{

    const {id} = req.params;

    // const currentUserId = req.session.user_id;
    const currentUserId = req.body.me;

    try {
        const chat = await Message.findAll({
            where:{
                [Op.or]: [
                    {sender_id: id, receiver_id: currentUserId},
                    {sender_id: currentUserId , receiver_id: id },
                ],
            },
            order: [['createdAt', 'ASC']],
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json(err);
    }
})


// Exports the routes
module.exports = router;