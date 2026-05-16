const { findUser } = require('../services/userServices')
const { getWordsFromCategory, saveWords } = require('../services/wordsServices')

const getAllWords = async (req, res) => {
    try {
        const category = req.params.category
        const userId = req?.id

        const wordsMemory = await getWordsFromCategory(category)

        const foundUser = await findUser("_id", userId)

        const wordsMongo = foundUser.words[category]

        const words = [...wordsMemory, ...wordsMongo]

        res.status(200).json(words)
    } catch (err) {
        console.error({
            message: err.message,
            route: req.originalUrl,
            method: req.method,
        })
        res.status(500).json({ message: "Erro ao buscar palavras" })
    }
}

const addNewWord = async (req, res) => {
    try {
        const { word, translations, category, wordClass } = req.validatedData
        const userId = req?.id

        if (!userId) {
            return res.status(400).json({ message: "ID é necessário" })
        }

        const foundUser = await findUser("_id", userId)

        const wordsMongo = foundUser.words[category]

        let newIdWord

        if (!wordsMongo.length) {
            const wordsMemory = await getWordsFromCategory(category)

            newIdWord = wordsMemory[wordsMemory.length - 1].id + 1
        } else {
            newIdWord = wordsMongo[wordsMongo.length - 1].id + 1
        }

        const newWord = { id: newIdWord, word, translations, wordClass, custom: true }

        const newWordsArray = [...wordsMongo, newWord]

        await saveWords(foundUser, category, newWordsArray)

        res.status(201).json({ message: `Nova palavra ${word} adicionada` })
    } catch (err) {
        console.error({
            message: err.message,
            route: req.originalUrl,
            method: req.method,
        })
        res.status(500).json({ message: "Erro ao adicionar palavra" })
    }
}

const updateWord = async (req, res) => {
    try {
        const { id, word, translations, wordClass, previousCategory, nextCategory } = req.validatedData
        const userId = req?.id

        if (!userId) {
            return res.status(400).json({ message: "ID de usuário é necessário" })
        }

        const foundUser = await findUser("_id", userId)
        const wordsMongo = foundUser.words[previousCategory]

        const selectedWord = wordsMongo.find(word => word.id === parseInt(id))

        if (!selectedWord.custom) {
            return res.status(400).json({ message: "Não é possível atualizar essa palavra!" })
        }

        const wordsArray = wordsMongo.filter(word => word.id !== parseInt(id))

        if (previousCategory !== nextCategory) {

            foundUser.words[previousCategory] = wordsArray

            const nextCategoryMemoryArray = await getWordsFromCategory(nextCategory)

            const nextCategoryMongoArray = foundUser.words[nextCategory]

            const updatedWord = {
                id: nextCategoryMongoArray.length ? nextCategoryMongoArray[nextCategoryMongoArray.length - 1].id + 1 : nextCategoryMemoryArray[nextCategoryMemoryArray.length - 1].id + 1,
                word,
                translations,
                wordClass: wordClass.toLowerCase(),
            }

            const updatedWordsArray = [...nextCategoryMongoArray, updatedWord].sort((a, b) => a.id - b.id)

            await saveWords(foundUser, nextCategory, updatedWordsArray)

            return res.json(updatedWordsArray)

        } else {

            const updatedWord = {
                id,
                word,
                translations,
                wordClass: wordClass.toLowerCase(),
            }

            const updatedWordsArray = [...wordsArray, updatedWord].sort((a, b) => a.id - b.id)

            await saveWords(foundUser, nextCategory, updatedWordsArray)

            return res.json(updatedWordsArray)
        }
    } catch (err) {
        console.error({
            message: err.message,
            route: req.originalUrl,
            method: req.method,
        })
        res.status(500).json({ message: "Erro ao atualizar palavra" })
    }
}

const deleteWord = async (req, res) => {
    try {
        const { id, category } = req.validatedData
        const userId = req?.id

        if (!userId) {
            return res.status(400).json({ message: "ID de usuário é necessário" })
        }

        const foundUser = await findUser("_id", userId)
        const wordsMongo = foundUser.words[category]

        const selectedWord = wordsMongo.find(word => word.id === parseInt(id))

        if (!selectedWord) {
            return res.status(400).json({ message: "Essa palavra não existe!" })
        }

        if (!selectedWord.custom) {
            return res.status(400).json({ message: "Não é possível deletar essa palavra!" })
        }

        const wordsArray = wordsMongo.filter(word => word.id !== parseInt(id))

        await saveWords(foundUser, category, wordsArray)

        res.json(selectedWord)
    } catch (err) {
        console.error({
            message: err.message,
            route: req.originalUrl,
            method: req.method,
        })
        res.status(500).json({ message: "Erro ao excluir palavra" })
    }
}

module.exports = {
    getAllWords,
    addNewWord,
    updateWord,
    deleteWord
}