const path = require('path')
const fsPromises = require('fs').promises
const UserWords = require('../../model/UserWords')
const setWordCategory = require('../../lib/setWordCategory')

const getAllWords = async (req, res) => {
    try {
        const category = req.params.category
        const userId = req?.id

        const wordsDefault = JSON.parse(await fsPromises.readFile(path.join(__dirname, '..', '..', 'data', 'words', 'words.json'), "utf8"))

        const wordsCategory = wordsDefault.filter((word) => word.tags.includes(category))

        const wordsMongo = await UserWords.find({
            userId,
            tags: { $in: [category] }
        })

        res.status(200).json([...wordsCategory, ...wordsMongo])
    } catch (err) {
        res.status(500).json({message: "Erro no servidor"})
    }
}

const addNewWord = async (req, res) => {
    try {
        const { word, translations, wordClass } = req.validatedData
        const userId = req?.id

        const wordsDefault = JSON.parse(await fsPromises.readFile(path.join(__dirname, '..', '..', 'data', 'words', 'words.json'), "utf8"))

        const duplicate = wordsDefault.filter((w) => w.word === word)

        if (duplicate.length) {
            return res.status(409).json({ message: "A palavra já está na lista" })
        }

        const tags = wordClass.map((w) => setWordCategory(w))

        const newWord = { word: word.toLowerCase().trim(), translations, wordClass, userId, tags }

        const addedWord = await UserWords.create(newWord)

        res.status(201).json({ message: `Nova palavra ${addedWord.word} adicionada` })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "A palavra já está na lista"
            })
        }

        res.status(500).json({ message: "Erro no servidor" })
    }
}

const updateWord = async (req, res) => {
    try {
        const { word, translations, wordClass } = req.validatedData
        const wordId = req.params.id
        const userId = req?.id

        const wordsDefault = JSON.parse(await fsPromises.readFile(path.join(__dirname, '..', '..', 'data', 'words', 'words.json'), "utf8"))

        const duplicate = wordsDefault.filter((w) => w.word === word)

        if (duplicate.length) {
            return res.status(409).json({ message: "A palavra já está na lista" })
        }

        const wordToUpdate = await UserWords.findOne({ _id: wordId, userId })

        if (!wordToUpdate) {
            return res.status(404).json({ message: "Palavra não encontrada" })
        }

        wordToUpdate.word = word.toLowerCase().trim()
        wordToUpdate.translations = translations
        wordToUpdate.wordClass = wordClass
        wordToUpdate.tags = wordClass.map((w) => setWordCategory(w))

        await wordToUpdate.save()

        res.status(200).json(wordToUpdate)
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "A palavra já está na lista"
            })
        }

        return res.status(500).json({
            message: "Erro no servidor"
        })

    }
}

const deleteWord = async (req, res) => {
    try {
        const wordId = req.params.id
        const userId = req?.id

        const wordToDelete = await UserWords.deleteOne({
            _id: wordId, userId
        })

        if (wordToDelete.deletedCount === 0) {
            return res.status(404).json({ message: "Palavra não encontrada" })
        }

        res.status(200).json(wordToDelete)
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor" })
    }
}

module.exports = {
    getAllWords,
    addNewWord,
    updateWord,
    deleteWord
}