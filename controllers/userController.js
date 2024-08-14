const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Set token in a cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.json({ message: 'Logged in successfully', 'token': token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Logout User
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

// Get Watch History
exports.getWatchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('watchHistory');
        res.json(user.watchHistory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Number of Subscribers
exports.getNumberOfSubscribers = async (req, res) => {
    try {
        const subscriberCount = await Subscription.countDocuments({ subscribedTo: req.user });
        res.json({ subscriberCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};