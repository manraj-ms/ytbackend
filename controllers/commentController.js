const Comment = require('../models/Comment');

// Add Comment to Video
exports.addComment = async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;

    try {
        const comment = new Comment({
            content,
            user: req.user,
            video: videoId,
        });

        await comment.save();
        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete Comment from Video
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Comments for a Video
exports.getCommentsForVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
        const comments = await Comment.find({ video: videoId }).populate('user', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
