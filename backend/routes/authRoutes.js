const express = require('express');
const router = express.Router();
const { sendRegisterOTP, registerUser, loginUser } = require('../controllers/authController');

router.post('/send-register-otp', sendRegisterOTP);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
