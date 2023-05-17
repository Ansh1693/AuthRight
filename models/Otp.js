const mongoose = require('mongoose');
const User = require('./user');

const otpSchema = new mongoose.Schema({
    otp:{
        type: String,
        required: true,
        default: null,
        min: 4,
        max: 4,
    },
    user:{
        type: String,
        required: true,
    },
    used: {
        type: Boolean,
        required: true,
        default: false,
    },
    expiresAt: { type: Date, default: Date.now, expires: 36000 }
});

// otpSchema.index({ expireAt: 0 }, { expireAfterSeconds: 3600 });

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
