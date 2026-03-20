const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// @desc    Create Razorpay Order & Pending Booking
// @route   POST /api/bookings/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    
    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({ message: 'Show and seats are required' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if seats are already booked for this show
    const existingBookings = await Booking.find({ show: showId });
    let isBooked = false;
    existingBookings.forEach(booking => {
      seats.forEach(seat => {
        if (booking.seats.includes(seat)) {
          isBooked = true;
        }
      });
    });

    if (isBooked) {
      return res.status(400).json({ message: 'One or more seats are already booked' });
    }

    const totalAmount = show.price * seats.length;

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create a pending booking in DB
    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      seats,
      totalAmount,
      razorpayOrderId: order.id,
      paymentStatus: 'pending'
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      bookingId: booking._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/bookings/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update booking status
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = 'completed';
        booking.razorpayPaymentId = razorpay_payment_id;
        await booking.save();
        res.json({ success: true, message: 'Payment verified and booking confirmed' });
      } else {
        res.status(404).json({ success: false, message: 'Booking not found' });
      }
    } else {
      res.status(400).json({ success: false, message: 'Invalid Signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error verifying payment' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, paymentStatus: 'completed' })
      .populate({
        path: 'show',
        populate: { path: 'movie', select: 'title posterUrl' }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching bookings' });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').populate({ path: 'show', populate: { path: 'movie', select: 'title' } }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching all bookings' });
  }
};

module.exports = { createOrder, verifyPayment, getMyBookings, getAllBookings };
