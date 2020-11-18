const express =  require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const router = express.Router();
const db = require('../database');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
module.exports = router;
app.use('/styles', express.static('styles'));

router.get('/', (req, res) => {
    let userid = req.session.userid;

    db.any('SELECT petid, petname, imageurl, favorites FROM pets WHERE userid = $1', [userid])
    .then(result => {
        res.render('dashboard', {pets: result});
    }).catch((error) => console.log(error))
})

router.get('/sign-out', (req, res) => {
    req.session.isAuthenticated = false;
    res.redirect('/index')
})