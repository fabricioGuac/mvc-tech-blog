const router = require('express').Router();

router.get('/signup', (req, res) => {
    console.log('I dont know what im doing');
    res.status(200).render('signUp');
})

router.get('/login', (req, res) => {
    console.log('I dont know what im doing');
    res.status(200).render('login');
})
module.exports = router;