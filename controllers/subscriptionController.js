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
            return res.sendResponse('Subscription removed');
        }

        const subscription = new Subscription({
            subscriber: req.user,
            subscribedTo: userId,
        });

        await subscription.save();
        res.sendResponse('Subscribed successfully', subscription, 201);
    } catch (error) {
        next(error)
    }
};

// Get All Users Subscribed by Current User
exports.getSubscribedUsers = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ subscriber: req.user }).populate('subscribedTo', 'username');
        const subscribedUsers = subscriptions.map(sub => sub.subscribedTo);
        res.sendResponse('Subscribed users retrieved successfully', subscribedUsers);
    } catch (error) {
        next(error)
    }
};