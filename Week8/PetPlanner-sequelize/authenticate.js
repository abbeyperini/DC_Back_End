function authenticate(req, res, next) {
    if (req.session) {
        if (req.session.isAuthenticated) {
            next();
        } else {
            res.redirect('/');
        };
    } else {
        res.redirect('/');
    };
};

exports.authenticate = authenticate;