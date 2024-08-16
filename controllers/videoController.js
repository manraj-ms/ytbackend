const Video = require('../models/Video');

// Add Video
exports.addVideo = async (req, res) => {
    const { title, description, videoName } = req.body;

    try {
        const video = new Video({
            title,
            description,
            videoName,
            user: req.user,
        });

        await video.save();
        res.sendResponse('Video added successfully', video, 201);
    } catch (error) {
        next(error)
    }
};

// Delete Video
exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);

        if (!video) {
            return res.sendResponse('Video not found', null, 404);
        }

        if (video.user.toString() !== req.user) {
            return res.sendResponse('Unauthorized', null, 401);
        }

        await video.deleteOne();
        res.sendResponse('Video deleted successfully');
    } catch (error) {
        next(error)
    }
};

// Get Video by ID
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId).populate({path: 'user',
            select: 'username'});
        if (!video) {
            return res.sendResponse('Video not found', null, 404);
        }
        res.json(video);
    } catch (error) {
        next(error)
    }
};