const Show = require('../models/Show');
const Booking = require('../models/Booking');

// @desc    Get shows by movie ID
// @route   GET /api/shows?movie=movieId
// @access  Public
const getShows = async (req, res) => {
  try {
    const { movie } = req.query;
    let query = {};
    if (movie) {
      query.movie = movie;
    }
    const shows = await Show.find(query).populate('movie', 'title duration');
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching shows' });
  }
};

// @desc    Get seats for a given show
// @route   GET /api/shows/:id/seats
// @access  Public
const getShowSeats = async (req, res) => {
  try {
    const showId = req.params.id;
    // Find all completed or pending bookings for this show
    // We consider 'pending' as temporarily blocked, maybe add expiration logic later
    const bookings = await Booking.find({ show: showId });
    
    // Extract all booked seats into a single array
    let bookedSeats = [];
    bookings.forEach(booking => {
      bookedSeats = [...bookedSeats, ...booking.seats];
    });

    res.json({ bookedSeats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching seats' });
  }
};

const createShow = async (req, res) => { try { const show = await Show.create(req.body); res.status(201).json(show); } catch (e) { res.status(400).json({ message: 'Invalid show data' }); } };
const updateShow = async (req, res) => { try { const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (show) res.json(show); else res.status(404).json({ message: 'Show not found' }); } catch (e) { res.status(400).json({ message: 'Error updating show' }); } };
const deleteShow = async (req, res) => { try { const show = await Show.findByIdAndDelete(req.params.id); if (show) res.json({ message: 'Show removed' }); else res.status(404).json({ message: 'Show not found' }); } catch (e) { res.status(500).json({ message: 'Error deleting show' }); } };

module.exports = { getShows, getShowSeats, createShow, updateShow, deleteShow };
