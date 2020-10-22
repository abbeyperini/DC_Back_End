exports.authenticate = authenticate;
exports.persistedUser = persistedUser;

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

function persistedUser(username, password) {
    const persisted = users.find(user => {
        return user.username == username && user.password == password;
    });
    
    if (persisted) {
        return true;
    } else {
        return false;
    };
};