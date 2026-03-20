const express = require('express');
const router = express.Router();
const { getShows, getShowSeats, createShow, updateShow, deleteShow } = require('../controllers/showController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.get('/', getShows);
router.get('/:id/seats', getShowSeats);
router.post('/', protect, admin, createShow);
router.put('/:id', protect, admin, updateShow);
router.delete('/:id', protect, admin, deleteShow);

module.exports = router;
