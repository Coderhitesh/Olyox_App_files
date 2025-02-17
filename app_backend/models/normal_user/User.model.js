const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    number: {
        type: String,
    },
    tryLogin:{
        type:Boolean,
        default:false
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    email: { 
        type: String,
        unique: true, // Optional: Make email unique if required
    },
    name: {
        type: String,
    },
    isOtpVerify:{
        type:Boolean,
        default:false
    },
    isGoogle: {
        type: Boolean,
        default: false,
    },
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
