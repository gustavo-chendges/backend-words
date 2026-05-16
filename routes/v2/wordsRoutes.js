const express = require('express')
const router = express.Router()
const wordsControllers = require('../../controllers/v2/wordsControllers')
const verifyJWT = require('../../middleware/verifyJWT')
const validateRequest = require('../../middleware/validateRequest')
const { addNewWordSchema, updateWordSchema } = require('../../validators/v2/wordsSchemas')
const { wordLimiter } = require('../../config/rateLimit')

router.route('/')
    .post(verifyJWT, validateRequest(addNewWordSchema), wordLimiter, wordsControllers.addNewWord)

router.route('/:category')
    .get(verifyJWT, wordLimiter, wordsControllers.getAllWords)

router.route('/:id')
    .patch(verifyJWT, validateRequest(updateWordSchema), wordLimiter, wordsControllers.updateWord)
    .delete(verifyJWT, wordLimiter, wordsControllers.deleteWord)

module.exports = router