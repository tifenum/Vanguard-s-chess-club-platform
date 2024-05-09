const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    chess: {
        type: String
    },
    password: {
        type: String
    },
    attachments: {
        type: String, 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isLoggedIn: {
        type: Boolean,
        default: false
      }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
