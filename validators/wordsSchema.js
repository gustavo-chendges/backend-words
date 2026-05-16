const { z } = require('zod')

const categoryEnum = z.enum(['nouns', 'adjectives', 'verbs', 'grammatical'], {
    required_error: "A categoria da palavra é obrigatória",
    invalid_type_error: "Categoria de palavra inválida"
})

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

const addNewWordSchema = z.object({
    word: z.string().min(1, "A palavra é obrigatória"),
    translations: z.array(
        z.string().min(1, "A tradução não pode ser vazia")
    ).min(1, "Pelo menos uma tradução é obrigatória").max(3, "Máximo de três traduções"),
    category: categoryEnum,
    wordClass: wordClassEnum
})

const updateWordSchema = z.object({
    id: z.coerce.number().min(1, "O ID da palavra é obrigatório"),
    word: z.string().trim().min(1, "A palavra é obrigatória"),
    translations: z.array(z.string().trim().min(1, "A tradução não pode ser vazia")).min(1, "Pelo menos uma tradução é obrigatória").max(3, "Máximo de três traduções"),
    wordClass: wordClassEnum,
    previousCategory: categoryEnum,
    nextCategory: categoryEnum
}).refine(
    (data) => data.id !== undefined || data.word !== undefined || data.wordClass !== undefined || data.translations !== undefined || data.previousCategory !== undefined || data.nextCategory !== undefined, { message: "Pelo menos um campo de ser atualizado" })

const deleteWordSchema = z.object({
    id: z.coerce.number().min(1, "O ID da palavra é obrigatório"),
    category: categoryEnum,
})


module.exports = {
    addNewWordSchema,
    updateWordSchema,
    deleteWordSchema
}