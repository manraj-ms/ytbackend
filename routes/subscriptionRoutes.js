const express = require('express');
const { toggleSubscription, getSubscribedUsers } = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:userId/toggle', auth, toggleSubscription);
router.get('/subscribed', auth, getSubscribedUsers);

module.exports = router;
