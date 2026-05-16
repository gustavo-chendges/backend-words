const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    recoverTokenValidated: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    refreshToken: {
        type: String,
        default: ""
    },
    verifyToken: {
        type: String,
        default: ""
    },
    recoverToken: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('User', userSchema)