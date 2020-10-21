const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const moviesRouter = require('./routes/movies')
const mustacheExpress = require('mustache-express');
const { v4: uuidv4 } = require('uuid');
const VIEWS_PATH = path.join(__dirname, '/views')

app.use(bodyParser.urlencoded({extended: false})); // body parser
app.use('/movies', moviesRouter);
app.use('/styles', express.static('styles'));

app.engine('mustache', mustacheExpress());
app.set('views', VIEWS_PATH);
app.set('view engine', 'mustache');

global.moviesArray = [];

app.get('/', (req, res) => {
    res.redirect('movies')
})

app.listen(3000, () => {
    console.log("Server is running...");
});