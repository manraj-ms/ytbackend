const express = require('express');
const { register, login, logout, getWatchHistory, getNumberOfSubscribers } = require('../controllers/userController');
const auth = require('../middleware/auth'); // JWT authentication middleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/watch-history', auth, getWatchHistory);
router.get('/subscribers', auth, getNumberOfSubscribers);

module.exports = router;
