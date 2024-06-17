const router = require('express').Router();
const { User } = require('../../models');



router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user) {
            return res.status(404).json({ message: "Incorrect email or password" });
        }

        const vali = await user.checkPassword(req.body.password);

        if (!vali) {
            return res.status(404).json({ message: "Incorrect email or password" });
        }

        req.session.save(() => {
            req.session.user_id = user.id;
            req.session.logged_in = true;
            res.status(200).json({ user: user, message: "Welcome" });
        });

    } catch (err) {
        res.status(400).json(err);
    }
})


router.post('/signin', async (req, res) => {
    try {
        const used = await User.findOne({ where: { email: req.body.email } });
        if (used) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const newUser = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
            res.status(200).json(newUser);
        });

    } catch (err) {
        res.status(400).json(err);
    }
})

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
