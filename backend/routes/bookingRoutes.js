const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/mybookings', protect, getMyBookings);
router.get('/', protect, admin, getAllBookings);

module.exports = router;
