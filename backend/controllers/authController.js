const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendRegisterOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const otp = generateOTP();

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    const message = `Your CineMax Registration OTP is: ${otp}\nValid for 5 minutes.`;
    const emailSent = await sendEmail({
      email,
      subject: 'Verify your email for Registration',
      message
    });

    if (emailSent) {
      console.log(`Registration OTP for ${email}: ${otp}`);
      return res.status(200).json({ success: true, message: 'OTP sent to email. Please verify.' });
    } else {
      console.log(`[Dev Fallback] SMTP failed. OTP for ${email}: ${otp}`);
      return res.status(200).json({ success: true, message: 'OTP logged to server console (SMTP failed)' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error when sending registration OTP' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    
    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: 'Please provide all required fields including OTP' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Verify OTP
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clean up OTP
    await OTP.deleteMany({ email });

    const role = email.includes('admin') ? 'admin' : 'user';
    const user = await User.create({ name, email, password, role });
    
    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id, user.email, user.role),
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id, user.email, user.role),
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { sendRegisterOTP, registerUser, loginUser };
