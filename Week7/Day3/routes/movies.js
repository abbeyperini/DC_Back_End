const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
module.exports = router
app.use('/styles', express.static('styles'))

// View all movies (Show the poster image and the name of the movie on this age)
router.get('/', (req,res) => {
    res.render('movies', {movies: moviesArray});
})

// add a movie (title, description, genre, posterURL)
router.post('/create', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const genre = req.body.genre;
    const image = req.body.image;
    const id = uuidv4();
    
    let movie = {
        title: title,
        description: description,
        image: image,
        movieID: id,
        genre: genre
    };

    moviesArray.push(movie);

    res.redirect('/');
});

// Deletes a movie
router.post('/delete', (req, res) => {
    let movieID = req.body.movieID;
    //filter movies and ignore the movie with the selected ID
    moviesArray = moviesArray.filter(movie => {
        return movie.movieID != movieID;
    });
    
    res.redirect('/');
});

// Details about the movie (Show poster image, title, genre and description on this page)
router.post('/movieID/:movieID', (req, res) => {
    const movieID = req.params.movieID;

    let detailedMovie = moviesArray.filter(movie => {
        return movie.movieID == movieID;
    });

    res.render('details', {details: detailedMovie})
});

let genreArray = [];

// filter movies based on genre
router.get('/genre/:genre', (req, res) => {
    let genreSearch = req.params.genre;

    genreArray = moviesArray.filter(movie => {
        return movie.genre == genreSearch;
    });

    res.render('genre', {genreMovies: genreArray})
});