const router = require('express').Router();
const auth = require('../utils/auth');

router.get('/',(req, res) => {
    res.status(200).render('homepage', { logged_in: req.session.logged_in })
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

router.get('/dashboard',auth,(req, res) => {
    res.status(200).render('dashboard', { logged_in: req.session.logged_in })
})


module.exports = router;