const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
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

module.exports = mongoose.model('Message', UserSchema);
