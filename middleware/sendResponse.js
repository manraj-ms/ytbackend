const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFilePath = path.join(logDir, 'response.log');

const sendResponse = (req, res, next) => {
    res.sendResponse = (message, data) => {
        const log = `[${new Date().toLocaleString()}] ${message}`;

        // Ensure log directory exists
        fs.mkdir(logDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating log directory:', err);
            } else {
                // Write successful response to log file
                fs.appendFile(logFilePath, log + '\n', (err) => {
                    if (err) {
                        console.error('Error writing to response log file:', err);
                    }
                });
            }
        });

        res.json({
            success: true,
            message: message,
            data: data
        });
    };
    next();
};

module.exports = sendResponse;
