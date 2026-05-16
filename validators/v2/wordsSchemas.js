const { z } = require('zod')

const wordClassEnum = z.enum([
    "preposition",
    "numeral",
    "article",
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "conjunction",
    "interjection"], {
    required_error: "A classe da palavra é obrigatória",
    invalid_type_error: "Classe da palavra inválida"
})

const categoryClassEnum = z.array(
    z.enum([
        'nouns',
        'adjectives',
        'verbs',
        'grammatical'
    ])
)

const addNewWordSchema = z.object({
    word: z.string().trim().min(1, "A palavra é obrigatória"),
    translations: z.array(
        z.string().min(1, "A tradução não pode ser vazia")
    ).min(1, "Pelo menos uma tradução é obrigatória").max(3, "Máximo de três traduções"),
    wordClass: z.array(wordClassEnum),
    category: categoryClassEnum.optional()
})

const updateWordSchema = z.object({
    word: z.string().trim().min(1, "A palavra é obrigatória"),
    translations: z.array(z.string().trim().min(1, "A tradução não pode ser vazia")).min(1, "Pelo menos uma tradução é obrigatória").max(3, "Máximo de três traduções"),
    wordClass: z.array(wordClassEnum),
}).refine(
    (data) => data.word !== undefined || data.wordClass !== undefined || data.translations !== undefined, { message: "Pelo menos um campo de ser atualizado" })

module.exports = {
    addNewWordSchema,
    updateWordSchema,
}