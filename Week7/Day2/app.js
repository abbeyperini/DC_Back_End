const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded()); // body parser
app.use(express.static('css'))

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

let trips = [];

app.get('/', (req, res) => {
    res.render('index', {allTrips: trips});
});

app.post('/create-trip', (req, res) => {
    const city = req.body.city;
    const departureObj = new Date(req.body.departure);
    const returnObj = new Date(req.body.return);
    const departFormat = `${(departureObj.getMonth() + 1)}/${departureObj.getDate()}/${departureObj.getFullYear()}`
    const returnFormat = `${(returnObj.getMonth() + 1)}/${returnObj.getDate()}/${returnObj.getFullYear()}`
    const image = req.body.image;
    const id = uuidv4();
    
    let trip = {
        city: city,
        departure: departureObj,
        return: returnObj,
        departFormat: departFormat,
        returnFormat: returnFormat,
        image: image,
        tripID: id
    };
    trips.push(trip);

    res.redirect('/');
});

app.post('/delete-trip', (req, res) => {
    let tripID = req.body.tripID;
    //filter todos and ignore the todo item with the taskID to be deleted
    trips = trips.filter(trip => {
        return trip.tripID != tripID;
    });
    
    res.redirect('/');
});

app.get('/sort-depart', (req, res) => {
    const sortedTrips = trips.sort((a, b) => a.departure - b.departure);
    res.render('index', {allTrips: sortedTrips});
});

app.post('/filter-city', (req, res) => {
    let tripCity = req.body.city;

    //filter todos and ignore the todo item with the taskID to be deleted
    let cityTrips = trips.filter(trip => {
        return trip.city == tripCity;
    });
    
    res.render('index', {allTrips: cityTrips});
})

app.get('/update', (req, res) => {
    res.render('update', {allTrips: trips});
})

app.post('/update-trip', (req, res) => {
    const id = req.body.tripID;
    const city = req.body.city;
    const departureObj = new Date(req.body.departure);
    const returnObj = new Date(req.body.return);
    const departFormat = `${(departureObj.getMonth() + 1)}/${departureObj.getDate()}/${departureObj.getFullYear()}`
    const returnFormat = `${(returnObj.getMonth() + 1)}/${returnObj.getDate()}/${returnObj.getFullYear()}`
    const image = req.body.image;
    
    for (i = 0; i < trips.length; i++) {
        if (trips[i].tripID == id) {

            trips[i].city = city;
            trips[i].departure = departureObj;
            trips[i].return = returnObj;
            trips[i].departFormat = departFormat;
            trips[i].returnFormat = returnFormat;
            trips[i].image = image;
            trips[i].tripID = id;
        }
    }

    res.redirect('/');
})

app.listen(3000, () => {
    console.log("Server is running...");
});