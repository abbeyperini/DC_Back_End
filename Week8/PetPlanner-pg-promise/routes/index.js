const express =  require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const authenticate = require('../authenticate');
const bcrypt = require('bcryptjs');
const db = require('../database');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
module.exports = router;
app.use('/styles', express.static('styles'));

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    // click button to register
    res.render('register');
});

router.post('/register/user', (req, res) => {
    // if authenticated, redirect to dashboard
    // if null redirect to register
    if (req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;

        db.any('SELECT userid FROM users WHERE username = $1', [username])
        .then((result) => {
            if (result.length > 0) {
                res.render('index', {message: "Username exists."})
            } else {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) {
                            res.redirect('/register', {message: "Something went wrong with the hash."})
                        } else {
                            db.none('INSERT INTO users(username, password) VALUES($1,$2)',[username, hash])
                            .then( () => {                            
                                if (req.session) {
                                    res.redirect('/index')
                                } else {
                                    res.render('index', {message: "Something went wrong."})
                                }
                            }).catch((error) => console.log(error))
                        };
                    });
                });
            }
        }).catch((error) => console.log(error))
    } else {
        res.render('register', {message: "Please enter a new username and password."});
    };
});

router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;
        // verify user exists, redirect to dashboard
        db.any('SELECT userid, password FROM users WHERE username = $1', [username])
        .then((result) => {  
            if (result.length == 0) {
                res.render('register', {message: "Username does not exist - register below."})
            } else {
                result.forEach((item) => {
                    let user = {userid: item.userid, password: item.password}
                    bcrypt.compare(password, user.password, function(err, result) {
                        if (result) {
                            if (req.session) {
                                req.session.isAuthenticated = true;
                                req.session.userid = user.userid;
                                res.redirect('/dashboard')     
                            } else {
                                res.render('index', {message: "Something went wrong."})
                            }
                        }
                    });
                })
            }
        }).catch((error) => console.log(error))
    } else {
        res.render('register', {message: "Please enter new username and password."});
    };
});

