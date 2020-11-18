const express =  require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const router = express.Router();
const models = require('../models');
const { Op } = require('sequelize');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
module.exports = router;
app.use('/styles', express.static('styles'));

router.get('/add-pet', (req, res) => {
    res.render('createPet')
})

router.post('/create-pet', (req, res) => {
    let name = req.body.name;
    let favorites = req.body.favorites;
    let userId = req.session.userId;
    let published = '';

    if (req.body.published == "true") {
        published = true;
    } else {
        published = false;
    };

    let pet = models.pets.build({
        name: name,
        favorites: favorites,
        user_id: userId,
        isPublished: published
    });

    pet.save().then((savedPet) => {
        res.redirect('/dashboard')
    }).catch((error) => {
        console.log(error)
    })
})

router.get('/delete/:id', (req,res) => {
    let petId = req.params.id;

    models.pets.destroy({
        where: {
            id: petId
        }
    }).then(
        res.redirect('/dashboard')
    )
})

router.get('/edit/:id', (req, res) => {
    let petId = req.params.id;
    models.pets.findByPk(petId).then(pet => {
        res.render('editPet', {pets: pet})
    })
})

router.post('/edit-pet', (req, res) => {
    let petId = req.body.id;
    let name = req.body.name;
    let favorites = req.body.favorites;
    let published = '';

    if (req.body.published == "true") {
        published = true;
    } else {
        published = false;
    };

    models.pets.update({
        name: name,
        favorites: favorites,
        isPublished: published
    }, {
        where: {
            id: petId
        }
    }).then(updatedPet => {
        res.redirect('/dashboard')
    })
})
