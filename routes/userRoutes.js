const express = require('express')
const router = express.Router()
const usersControllers = require("../controllers/userControllers")

const verifyJWT = require('../middleware/verifyJWT')
const validateRequest = require('../middleware/validateRequest')
const { createNewUserSchema, updateUserSchema, resendVerificationEmailSchema, validateEmailSchema, validateDeleteUserWords } = require('../validators/userSchemas')

router.route('/')
    .post(validateRequest(createNewUserSchema), usersControllers.createNewUser)
    .patch(verifyJWT, validateRequest(updateUserSchema), usersControllers.updateUser)
    .delete(verifyJWT, usersControllers.deleteUser)

router.route('/verify_email')
    .post(validateRequest(resendVerificationEmailSchema), usersControllers.resendVerificationEmail)

router.route('/validate_user')
    .post(validateRequest(validateEmailSchema), usersControllers.validateEmail)

router.route('/delete_words')
    .post(verifyJWT, validateRequest(validateDeleteUserWords), usersControllers.deleteUserWords)

module.exports = router