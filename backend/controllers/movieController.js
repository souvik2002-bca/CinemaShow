const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching movies' });
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching movie' });
  }
};

const createMovie = async (req, res) => { try { const movie = await Movie.create(req.body); res.status(201).json(movie); } catch (e) { res.status(400).json({ message: 'Invalid movie data' }); } };
const updateMovie = async (req, res) => { try { const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (movie) res.json(movie); else res.status(404).json({ message: 'Movie not found' }); } catch (e) { res.status(400).json({ message: 'Error updating movie' }); } };
const deleteMovie = async (req, res) => { try { const movie = await Movie.findByIdAndDelete(req.params.id); if (movie) res.json({ message: 'Movie removed' }); else res.status(404).json({ message: 'Movie not found' }); } catch (e) { res.status(500).json({ message: 'Error deleting movie' }); } };

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
