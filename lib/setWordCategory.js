function setWordCategory(category) {
    if (['noun', 'pronoun', 'article', 'numeral'].includes(category.toLowerCase())) {
        return 'nouns'
    } else if (['adjective', 'adverb'].includes(category.toLowerCase())) {
        return 'adjectives'
    } else if (['verb'].includes(category.toLowerCase())) {
        return 'verbs'
    } else if (['preposition', 'conjunction', 'interjection'].includes(category.toLowerCase())) {
        return 'grammatical'
    } else {
        return ''
    }
}

module.exports = setWordCategory