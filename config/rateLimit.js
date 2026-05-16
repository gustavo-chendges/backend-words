const rateLimit = require('express-rate-limit')


const loginLimiter = rateLimit({
    windowMs: 1*60*1000,
    max: 5,
    message: {
        message: "Muitas requisições, tente novamente mais tarde"
    }
})

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        message: "Muitas requisições, tente novamente mais tarde"
    }
})

const wordLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: {
        message: "Muitas requisições, tente novamente mais tarde"
    }
})

module.exports = {
    loginLimiter,
    authLimiter,
    wordLimiter
}