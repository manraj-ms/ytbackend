const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser()); 

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ytbackend')
    .then(() => app.listen(7000, () => console.log('Server running on port 7000')))
    .catch(err => console.error('Database connection error:', err));
