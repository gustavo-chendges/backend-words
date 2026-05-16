const express = require('express')
const router = express.Router()
const wordsControllers = require('../controllers/wordsControllers')
const verifyJWT = require('../middleware/verifyJWT')
const validateRequest = require('../middleware/validateRequest')
const { addNewWordSchema, updateWordSchema, deleteWordSchema } = require('../validators/wordsSchema')

router.use(verifyJWT)

router.route('/')
    .post(validateRequest(addNewWordSchema), wordsControllers.addNewWord)
    .patch(validateRequest(updateWordSchema), wordsControllers.updateWord)
    .delete(validateRequest(deleteWordSchema), wordsControllers.deleteWord)

router.route('/:category')
    .get(wordsControllers.getAllWords)

module.exports = router