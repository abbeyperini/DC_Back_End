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

router.get('/add-pet', (req, res) => {
    res.render('createPet')
})

router.post('/create-pet', (req, res) => {
    let petname = req.body.petname;
    let foodbrand = req.body.foodbrand;
    let amount = req.body.amount;
    let perday = req.body.perday;
    let favorites = req.body.favorites;
    let published = '';
    let userid = req.session.userid;
    let imageurl = req.body.imageurl;
    if (req.body.published == "true") {
        published = true;
    } else {
        published = false;
    };
    
    db.none('INSERT INTO pets(petname, foodbrand, amount, perday, favorites, published, imageurl, userid) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', 
    [petname, foodbrand, amount, perday, favorites, published, imageurl, userid])
    .then(
        res.redirect('/dashboard')
    ).catch((error) => console.log(error))
})

router.get('/community', (req, res) => {
    db.any('SELECT petname, imageurl, favorites FROM pets')
    .then(result => {
        res.render('community', {pets: result});
    }).catch((error) => console.log(error))
})

router.post('/delete', (req, res) => {
    let petid = req.body.petid;

    db.none('DELETE from pets WHERE petid = $1', [petid])
    .then(() => {
        console.log('DELETED')
        res.redirect('/dashboard')
    })
})

router.post('/edit', (req, res) => {
    let petid = req.body.petid;

    db.any('SELECT petid, petname, foodbrand, amount, perday, published, imageurl, favorites, datecreate, dateupdate FROM pets WHERE petid = $1', [petid])
    .then(result => {
        res.render('editPet', {pets: result});
    }).catch((error) => console.log(error))
})

router.post('/edit-pet/petname', (req, res) => {
    let petid = req.body.petid;
    let value = req.body.petname

    db.none("UPDATE pets SET petname = $1 WHERE petid = $2", [value, petid])
    .then(() => {
        res.redirect('/dashboard')
    }).catch((error) => console.log(error))
    
});

router.post('/edit-pet/foodbrand', (req, res) => {
    let petid = req.body.petid;
    let value = req.body.foodbrand

    db.none("UPDATE pets SET foodbrand = $1 WHERE petid = $2", [value, petid])
    .then(() => {
        res.redirect('/dashboard')
    }).catch((error) => console.log(error))
    
});

router.post('/edit-pet/amount', (req, res) => {
    let petid = req.body.petid;
    let value = req.body.amount

    db.none("UPDATE pets SET amount = $1 WHERE petid = $2", [value, petid])
    .then(() => {
        res.redirect('/dashboard')
    }).catch((error) => console.log(error))
    
});

router.post('/edit-pet/perday', (req, res) => {
    let petid = req.body.petid;
    let value = req.body.perday

    db.none("UPDATE pets SET perday = $1 WHERE petid = $2", [value, petid])
    .then(() => {
        res.redirect('/dashboard')
    }).catch((error) => console.log(error))
    
});

router.post('/edit-pet/favorites', (req, res) => {
    let petid = req.body.petid;
    let value = req.body.favorites

    db.none("UPDATE pets SET favorites = $1 WHERE petid = $2", [value, petid])
    .then(() => {
        res.redirect('/dashboard')
    }).catch((error) => console.log(error))
    
});

router.post('/edit-pet/imageurl', (req, res) => {
    let petid = req.body.petid;
    let value = req.body.imageurl

    db.none("UPDATE pets SET imageurl = $1 WHERE petid = $2", [value, petid])
    .then(() => {
        res.redirect('/dashboard')
    }).catch((error) => console.log(error))
    
});

router.post('/edit-pet/published', (req, res) => {
    let petid = req.body.petid;

    if (req.body.published == "true") {
        published = true;
    } else {
        published = false;
    };

    db.none('UPDATE pets SET published = $1 WHERE petid = $2', [published, petid])
    .then(() => {
        res.redirect('/dashboard')
    }).catch((error) => console.log(error));
})

router.post('/pet-care', async (req, res) => {
    let thispet = req.body.petid;
    let pets = [];

    let result = await db.any('SELECT pets.petid, imageurl, petname, service, name, phone FROM pets JOIN providers ON pets.petid = providers.petid WHERE pets.petid = $1', [thispet])
    
    result.forEach((item) => {
        if(pets.length == 0) {
            let pet = {petid: item.petid, imageurl: item.imageurl, petname: item.petname, providers: [{service: item.service, name: item.name, phone: item.phone}]}
            pets.push(pet)
        } else {
            let pet = pets.find(pet => pet.petid == item.petid)
            if (pet) {
                pet.providers.push({service: item.service, name: item.name, phone: item.phone})
            } else {
                let pet = {petid: item.petid, imageurl: item.imageurl, petname: item.petname, providers: [{service: item.service, name: item.name, phone: item.phone}]}
                pets.push(pet)
            }
        }
    })
    res.render('petcare', {pets: pets})
})

router.post('/add-care', (req, res) => {
    let service = req.body.service;
    let name = req.body.name;
    let phone = req.body.phone;
    let petid = req.body.petid;

    db.none('INSERT INTO providers(service, name, phone, petid) VALUES($1, $2, $3, $4)', 
    [service, name, phone, petid])
    .then(
        res.redirect('/dashboard')
    ).catch((error) => console.log(error))
})