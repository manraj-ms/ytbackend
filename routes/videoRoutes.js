const express = require('express');
const { addVideo, deleteVideo, getVideoById } = require('../controllers/videoController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, addVideo);
router.delete('/:videoId', auth, deleteVideo);
router.get('/:videoId', getVideoById);

module.exports = router;
