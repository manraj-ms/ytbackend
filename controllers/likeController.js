const Like = require('../models/Like');
const Video = require('../models/Video');

// Toggle Like on Video
exports.toggleLike = async (req, res) => {
    const { videoId } = req.params;

    try {
        const existingLike = await Like.findOne({ user: req.user, video: videoId });

        if (existingLike) {
            await existingLike.deleteOne();
            return res.sendResponse('Like removed');
        }

        const like = new Like({
            user: req.user,
            video: videoId,
        });

        await like.save();
        res.sendResponse('Video liked', like, 201);
    } catch (error) {
        next(error)
    }
};

// Get Liked Videos for a Particular User
exports.getLikedVideos = async (req, res) => {
    try {
        const likes = await Like.find({ user: req.user }).populate('video');
        const likedVideos = likes.map(like => like.video);
        res.sendResponse('Liked videos retrieved successfully', likedVideos);
    } catch (error) {
        next(error)
    }
};