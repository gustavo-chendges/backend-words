const path = require('path')
const fsPromises = require('fs').promises
const UserWords = require('../../model/UserWords')

async function getWords() {
    const words = JSON.parse(await fsPromises.readFile(path.join(__dirname, '..', '..', 'data', 'words', 'words.json'), "utf8", (err, data) => {
        if (err) throw err

        return data
    }))

    return words
}

module.exports = { getWords }