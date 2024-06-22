// Middleware to ensure the user is logged in before allowing access to sections that require the user to be logged in
const auth = (req, res, next) => {
    if (!req.session.logged_in) {
    res.redirect('/login');
    } else {
    next();
    }
};

module.exports = auth;