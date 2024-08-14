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
        res.status(201).json({ message: 'Video added successfully', video });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete Video
exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        if (video.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await video.deleteOne();
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Video by ID
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId).populate({path: 'user',
            select: 'username'});
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
