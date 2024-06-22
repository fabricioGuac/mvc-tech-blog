// Imports express router and the user model
const router = require('express').Router();
const { User } = require('../../models');


// Route to log in
router.post('/login', async (req, res) => {
    try {
        // Reads from the user table one user that has the req.body email
        const user = await User.findOne({ where: { email: req.body.email } })

        // If no user found with that email returns an error message
        if (!user) {
            return res.status(404).json({ message: "Incorrect email or password" });
        }

        // Validates the user password
        const vali = await user.checkPassword(req.body.password);

        // If the password does not pass the validation returns an error message
        if (!vali) {
            return res.status(404).json({ message: "Incorrect email or password" });
        }

        // Saves the session data before sending a response
        req.session.save(() => {
            // Assigns the user id to the session and the logged in flag to true
            req.session.user_id = user.id;
            req.session.logged_in = true;
            // Returns the user data and a welcome message
            res.status(200).json({ user: user, message: "Welcome" });
        });

    } catch (err) {
        res.status(400).json(err);
    }
})

// Route to sign in
router.post('/signin', async (req, res) => {
    try {
        // Reads the user table to find an user with the same email
        const used = await User.findOne({ where: { email: req.body.email } });
        // Sends an error message if the email is already taken
        if (used) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Creates a new user
        const newUser = await User.create(req.body);

        // Saves the session data before sending a response
        req.session.save(() => {
            // Assigns the user id to the session and the logged in flag to true
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
            // Returns the new user data
            res.status(200).json(newUser);
        });

    } catch (err) {
        res.status(400).json(err);
    }
})

// Route to log out
router.post('/logout', (req, res) => {
    // If the user is logged in destroys the session
    if (req.session.logged_in) {
        req.session.destroy(() => {
            // Send a 204 status code indicating successful logout and ends the response process
            res.status(204).end();
        });
    } else {
        // Send a 404 status if the user is not logged in
        res.status(404).end();
    }
});

// Exports the routes
module.exports = router;
