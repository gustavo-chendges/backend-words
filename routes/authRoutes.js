const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/authControllers')

const validateRequest = require('../middleware/validateRequest')
const verifyJWT = require('../middleware/verifyJWT')
const { loginSchema, passwordMatchSchema, sendRecoverPasswordEmailSchema, recoverPasswordSchema, resetPasswordSchema } = require('../validators/authSchemas')
const {loginLimiter, authLimiter} = require('../config/rateLimit')

router.route('/login')
    .post(loginLimiter, validateRequest(loginSchema), authControllers.login)

router.route('/password_match')
    .post(verifyJWT, validateRequest(passwordMatchSchema), authLimiter, authControllers.passwordMatch)

router.route('/refresh')
    .get(authLimiter, authControllers.refresh)

router.route('/logout')
    .get(authLimiter, authControllers.logout)

router.route('/forgot_password')
    .post(authLimiter, validateRequest(sendRecoverPasswordEmailSchema), authControllers.sendRecoverPasswordEmail)

router.route('/recover_password')
    .post(authLimiter, validateRequest(recoverPasswordSchema), authControllers.recoverPassword)

router.route('/reset_password')
    .post(authLimiter, validateRequest(resetPasswordSchema), authControllers.resetPassword)

module.exports = router