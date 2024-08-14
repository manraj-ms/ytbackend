const express = require('express');
const { addComment, deleteComment, getCommentsForVideo } = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:videoId', auth, addComment);
router.delete('/:commentId', auth, deleteComment);
router.get('/:videoId/comments', getCommentsForVideo);

module.exports = router;
