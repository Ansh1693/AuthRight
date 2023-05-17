const mongoose = require('mongoose');
const Otp = require('./Otp');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: 3,
        max: 255,
        unique: true
    },
    email:{
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    verified:{
        type: Boolean,
        required: true,
        default: false,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
