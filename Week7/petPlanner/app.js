const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const dashRoutes = require('./routes/dashboard');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');
const { dirname } = require('path');
const VIEWS_PATH = path.join(__dirname, '/views');
const authenticate = require('./authenticate');
const { runInNewContext } = require('vm');

app.use(session({
    secret: '7eaf4c82-aef6-4d3f-8264-59adedd77ed1',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use('/styles', express.static('styles'));
app.use('/images', express.static('images'))
app.engine('mustache', mustacheExpress());
app.set('views', VIEWS_PATH);
app.set('view engine', 'mustache');
app.use('/dashboard', authenticate.authenticate, dashRoutes);

global.users = [];

app.get('/', (req, res) => {
    // home page with login boxes
    res.render('index');
});

app.get('/register', (req, res) => {
    // click button to register
    res.render('register');
});

app.post('/register/user', (req, res) => {
    // if authenticated, redirect to dashboard
    // if null redirect to register
    if (req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;

        if (authenticate.persistedUser(username, password)) {
            res.render('index', {message: "Username exists."})
        } else {
            const userID = uuidv4();
        
            let user = {userID: userID, username: username, password: password, pets: []};
            users.push(user);

            if (req.session) {
                req.session.isAuthenticated = true;
                req.session.username = username;
                req.session.userID = userID;
                res.redirect('/dashboard')
            } else {
                res.render('index', {message: "Something went wrong."})
            }
        }
    } else {
        res.render('register', {message: "Please enter a new username and password."});
    };
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // verify user exists, redirect to dashboard

    if (authenticate.persistedUser(username, password)) {
        if (req.session) {
            req.session.isAuthenticated = true;
            req.session.username = username;

            let user = users.find(user => {
                return user.username == username;
            });

            req.session.userID = user.userID;

            res.redirect('/dashboard')
        } else {
            res.render('index', {message: "Something went wrong."})
        }
    } else {
        res.render('index', {message: 'Username or password is incorrect or username does not exist.'})
    }
});

app.listen(3000, () => {
    console.log("Server is running...");
});

// turn header into partial
// add input pattern specific validation alerts