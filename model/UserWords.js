const mongoose = require('mongoose')

const userWordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    word: {
        type: String,
        required: true
    },
    translations: {
        type: [String],
        required: true
    },
    wordClass: {
        type: [String],
        required: true,
        enum: [
            "preposition",
            "numeral",
            "article",
            "noun",
            "verb",
            "adjective",
            "adverb",
            "pronoun",
            "conjunction",
            "interjection"
        ]
    },
    tags: {
        type: [String],
        default: []
    },
    custom: {
        type: Boolean,
        default: true
    }
})

userWordSchema.index({ userId: 1, word: 1 }, { unique: true })

module.exports = mongoose.model('UserWord', userWordSchema)