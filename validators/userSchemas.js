const { z } = require('zod')

const createNewUserSchema = z.object({
    email: z.email("Email inválido"),
    username: z.string().trim().min(4, "O nome de usuário deve ter pelo menos 4 caracteres"),
    password: z.string().trim().min(8, "A senha deve ter pelo menos 8 caracteres")
})

const updateUserSchema = z.object({
    email: z.email("Email inválido").optional(),
    username: z.string().trim().min(4, "O nome de usuário deve ter pelo menos 4 caracteres").optional(),
    password: z.string().trim().min(8, "A senha deve ter pelo menos 8 caracteres").optional()
}).refine(
    (data) => (data.email !== undefined && data.email.length > 0) || (data.username !== undefined && data.username.length > 0) || (data.password !== undefined && data.password.length > 0), { message: "Pelo menos um campo deve ser atualizado"}
)

const resendVerificationEmailSchema = z.object({
    email: z.email("Email inválido")
})

const validateEmailSchema = z.object({
    email: z.email("Email inválido"),
    verifyToken: z.string().min(1, "O código de verificação é obrigatório")
})

const validateDeleteUserWords = z.object({
    categories: z.array(
        z.enum(['nouns', 'adjectives', 'verbs', 'grammatical'], {
            required_error: "Pelo menos uma categoria de palavras é obrigatória.",
            invalid_type_error: "Categoria de palavra inválida."
        })
    ).min(1, "Selecione pelo menos uma categoria de palavras")
})

module.exports = {
    createNewUserSchema,
    updateUserSchema,
    resendVerificationEmailSchema,
    validateEmailSchema,
    validateDeleteUserWords
}