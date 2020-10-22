const express =  require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
module.exports = router;
app.use('/styles', express.static('styles'));

router.get('/', (req, res) => {
    let user = users.find(user => {
        return user.username == req.session.username;
    });

    let pets = user.pets

    res.render('dashboard', {pets: pets});
})

router.get('/sign-out', (req, res) => {
    req.session.isAuthenticated = false;
    res.render('index')
})

router.post('/add-pet', (req, res) => {
    const petName = req.body.petName;
    const image = req.body.image;

    let pet = {petName: petName, image: image}

    let user = users.find(user => {
        return user.username == req.session.username;
    });

    user.pets.push(pet);
    res.redirect('/dashboard');
})