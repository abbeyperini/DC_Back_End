const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const indexRoutes = require('./routes/index.js');
const dashRoutes = require('./routes/dashboard');
const petRoutes = require('./routes/pet.js');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');
const { dirname } = require('path');
const VIEWS_PATH = path.join(__dirname, '/views');
const authenticate = require('./authenticate');
const secrets = require('./secrets');
const bcrypt = require('bcryptjs');
const models = require('./models');
const { Op } = require('sequelize');

app.use(session({
    secret: 'secrets.secret',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use('/styles', express.static('styles'));
app.use('/images', express.static('images'))
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'));
app.set('views', VIEWS_PATH);
app.set('view engine', 'mustache');
app.use('/index', indexRoutes);
// removed authentication middleware from two below
app.use('/dashboard', authenticate.authenticate, dashRoutes);
app.use('/pet', authenticate.authenticate, petRoutes);

app.get('/', (req, res) => {
    res.redirect('/index');
});

app.listen(3000, () => {
    console.log("Server is running...");
});