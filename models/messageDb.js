const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        trim: true,
        type: String,
        required: true,
    },
    toUser: {
        trim: true,
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Message', MessageSchema);
