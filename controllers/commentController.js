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
        res.sendResponse('Comment added successfully', comment, 201);
    } catch (error) {
        next(error)
    }
};

// Delete Comment from Video
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.sendResponse('Comment not found', null, 404);
        }

        if (comment.user.toString() !== req.user) {
            return res.sendResponse('Unauthorized', null, 401);
        }

        await comment.deleteOne();
        res.sendResponse('Comment deleted successfully', null);
    } catch (error) {
        next(error)
    }
};

// Get Comments for a Video
exports.getCommentsForVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
        const comments = await Comment.find({ video: videoId }).populate('user', 'username');
        res.sendResponse('Comments retrieved successfully', comments);
    } catch (error) {
        next(error)
    }
};