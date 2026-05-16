const path = require('path')
const fsPromises = require('fs').promises

async function getWordsFromCategory(category) {
    const wordsCategory = JSON.parse(await fsPromises.readFile(path.join(__dirname, '..', 'data', 'words', `${category}.json`), "utf8", (err, data) => {
        if (err) throw err

        return data
    }))

    return wordsCategory
}

async function saveWords(user, category, newWordsArray){
    user.words[category] = newWordsArray
    await user.save()
}

module.exports = {
    getWordsFromCategory,
    saveWords
}