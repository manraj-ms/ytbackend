const express = require('express');
const { toggleLike, getLikedVideos } = require('../controllers/likeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:videoId/toggle', auth, toggleLike);
router.get('/liked-videos', auth, getLikedVideos);

module.exports = router;
