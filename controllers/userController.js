const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Subscription = require('../models/Subscription')
const Video = require('../models/Video');

// Register User
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.sendResponse('User already exists', null, 400);
        }

        user = new User({
            username,
            email,
            password,
        });

        // Hash password
        user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.sendResponse('User registered successfully', null, 201);
    } catch (error) {
        next(error)
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.sendResponse('Invalid credentials', null, 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.sendResponse('Invalid credentials', null, 400);
        }

        // Create JWT
        const token = jwt.sign({ userId: user._id }, 'jwtsecret', { expiresIn: '1h' });

        // Set token in a cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.sendResponse('Logged in successfully', { token });
    } catch (error) {
        next(error)
    }
};

// Logout User
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.sendResponse('Logged out successfully', null);
};

// Get Watch History
exports.getWatchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('watchHistory');
        res.sendResponse('Watch history retrieved successfully', user.watchHistory);
    } catch (error) {
        next(error);
    }
};

// View Video and Add to Watch History
exports.viewVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
        // Find the video by ID
        const video = await Video.findById(videoId);
        if (!video) {
            return res.sendResponse('Video not found', null, 404);
        }

        // Find the user and update watch history
        const user = await User.findById(req.user);
        if (!user) {
            return res.sendResponse('User not found', null, 404);
        }

        // Check if the video is already in the watch history
        if (!user.watchHistory.includes(videoId)) {
            user.watchHistory.push(videoId);
            await user.save();
        }

        // Return the video details
        res.sendResponse('Video details retrieved successfully', video);
    } catch (error) {
        next(error)
    }
};

// Get Number of Subscribers and List of Subscribers
exports.getNumberOfSubscribers = async (req, res) => {
    try {
        // Find all subscriptions where the current user is being subscribed to
        const subscriptions = await Subscription.find({ subscribedTo: req.user })
                                                .populate('subscriber', 'username'); // Populate with username of the subscriber

        // Get the count of subscribers
        const subscriberCount = subscriptions.length;

        // Extract just the usernames of the subscribers
        const subscriberList = subscriptions.map(sub => sub.subscriber.username);

        // Return both the count and the list
        res.sendResponse('Subscriber count and list retrieved successfully', { subscriberCount, subscribers: subscriberList });
    } catch (error) {
        next(error)
    }
};
