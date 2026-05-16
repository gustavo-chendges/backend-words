const { z } = require('zod')

const loginSchema = z.object({
    username: z.string().trim().min(1, "Nome de usuário é obrigatório"),
    password: z.string().trim().min(1, "Senha é obrigatória")
})

const passwordMatchSchema = z.object({
    password: z.string().trim().min(1, "Senha é obrigatória")
})

const sendRecoverPasswordEmailSchema = z.object({
    email: z.email("Email inválido")
})

const recoverPasswordSchema = z.object({
    email: z.email("Email inválido"),
    recoverToken: z.string().min(1, "O código de recuperação é obrigatório")
})

const resetPasswordSchema = z.object({
    email: z.email("Email inválido"),
    newPassword: z.string().trim().min(8, "A nova senha é obrigatória")
})

module.exports = {
    loginSchema,
    passwordMatchSchema,
    sendRecoverPasswordEmailSchema,
    recoverPasswordSchema,
    resetPasswordSchema
}