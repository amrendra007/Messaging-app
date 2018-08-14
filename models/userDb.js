const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        trim: true,
        type: String,
        required: true,
    },
    lastName: {
        trim: true,
        type: String,
        required: true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
});

module.exports = mongoose.model('User', UserSchema);
