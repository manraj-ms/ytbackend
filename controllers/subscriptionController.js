const Subscription = require('../models/Subscription');

// Toggle Subscription
exports.toggleSubscription = async (req, res) => {
    const { userId } = req.params;

    try {
        const existingSubscription = await Subscription.findOne({
            subscriber: req.user,
            subscribedTo: userId,
        });

        if (existingSubscription) {
            await existingSubscription.deleteOne();
            return res.json({ message: 'Subscription removed' });
        }

        const subscription = new Subscription({
            subscriber: req.user,
            subscribedTo: userId,
        });

        await subscription.save();
        res.status(201).json({ message: 'Subscribed successfully', subscription });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get All Users Subscribed by Current User
exports.getSubscribedUsers = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ subscriber: req.user }).populate('subscribedTo', 'username');
        const subscribedUsers = subscriptions.map(sub => sub.subscribedTo);
        res.json(subscribedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
