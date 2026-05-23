const bcrypt = require('bcrypt')
const { loginService, createAccessToken, createRefreshToken } = require('../services/authServices')
const { createUser, deleteUserService, checkDuplicate, findUser, saveUserField, saveUser } = require('../services/userServices')
const { sendVerification } = require('../services/emailService')
const UserWords = require('../model/UserWords')

const createNewUser = async (req, res) => {
    const { email, username, password } = req.validatedData

    try {

        req.log.info({ username }, "Tentativa de criação de usuário")

        const duplicateUsername = await checkDuplicate("username", username)

        if (duplicateUsername) {
            req.log.warn({ username }, "Nome de usuário duplicado")
            return res.status(409).json({ message: 'Nome de usuário ou email duplicados' })
        }

        const duplicateEmail = await checkDuplicate("email", email)
        if (duplicateEmail) {
            req.log.warn({ username, email }, "Email duplicado")
            return res.status(409).json({ message: 'Nome de usuário ou email duplicados' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await createUser(email, username, hashedPassword)

        if (!user) {
            return res.status(400).json({ message: "Dados inválidos recebidos" })
        }

        try {
            await sendVerification(user)
        } catch (err) {
            req.log.error({ err, username }, "Erro no serviço do email de verificação")
        }

        const { accessToken, newRefreshToken } = await loginService({ username, password })

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        req.log.info({ username }, "Usuário criado com sucesso")
        return res.status(201).json({ message: `Novo usuário ${username} criado.`, accessToken })
    } catch (err) {
        req.log.error({ err, username, route: req.originalUrl, method: req.method }, "Erro ao criar usuário")
        return res.status(500).json({ message: "Erro ao criar o usuário" })
    }

}

const resendVerificationEmail = async (req, res) => {
    let foundUser

    try {
        const { email } = req.validatedData

        foundUser = await findUser("email", email)

        if (foundUser && !foundUser.emailVerified) {
            try {
                await sendVerification(foundUser)
                return res.status(200).json({ message: "Email de verificação enviado" })
            } catch (err) {
                req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro no serviço do envio do email de verificação")

                return res.status(500).json({ message: "Erro ao enviar email de verificação" })
            }
        }

        return res.status(200).json({
            message: "Se o email estiver cadastrado, um código de verificação será enviado"
        })
    } catch (err) {

        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao enviar email de verificação")

        return res.status(500).json({ message: "Erro ao enviar email de verificação" })
    }
}

const validateEmail = async (req, res) => {

    let foundUser

    try {
        const { email, verifyToken } = req.validatedData

        foundUser = await findUser("email", email)

        if (!foundUser) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        req.log.info({ username: foundUser.username }, "Tentativa de verificar email")

        const matchVerifyToken = await bcrypt.compare(verifyToken.toString(), foundUser.verifyToken)

        if (!matchVerifyToken) {
            return res.status(401).json({ message: "Código de verificação incorreto" })
        }

        saveUserField(foundUser, "emailVerified", true)
        saveUserField(foundUser, "verifyToken", "")
        await saveUser(foundUser)

        const accessToken = createAccessToken(foundUser)

        req.log.info({ username: foundUser.username }, "Email verificado com sucesso")
        return res.status(200).json({ message: "Email verificado com sucesso", accessToken })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao verificar o email")
        return res.status(500).json({ message: "Erro ao verificar o email" })
    }
}

const updateUser = async (req, res) => {
    const { email, username, password } = req.validatedData
    const id = req?.id

    let foundUser

    try {

        foundUser = await findUser("_id", id)

        if (!foundUser) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        req.log.info({ username: foundUser.username }, "Tentativa de atualização de usuário")

        let fields = {}

        if (username) {
            const duplicateUsername = await findUser("username", username)

            if (duplicateUsername && duplicateUsername._id.toString() !== id) {
                req.log.warn({ username }, "Nome de usuário duplicado")
                return res.status(409).json({ message: "Nome de usuário duplicado" })
            }

            fields.username = username
        }

        if (email) {

            const duplicateEmail = await findUser("email", email)

            if (duplicateEmail && duplicateEmail._id.toString() !== id) {
                req.log.warn({ username }, "Email duplicado")
                return res.status(409).json({ message: "Email duplicado" })
            }

            fields.email = email

            saveUserField(foundUser, "emailVerified", false)
        }

        if (password) {

            const hashedPassword = await bcrypt.hash(password, 10)
            fields.password = hashedPassword

            foundUser.tokenVersion += 1

            const refreshToken = createRefreshToken(foundUser)
            saveUserField(foundUser, "refreshToken", refreshToken)

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
        }

        Object.assign(foundUser, fields)
        await saveUser(foundUser)

        const accessToken = createAccessToken(foundUser)

        req.log.info({ username }, `${Object.keys(fields).join(", ")} alterados com sucesso`)
        return res.status(200).json({ message: `Field(s) ${Object.keys(fields).join(", ")} updated`, accessToken })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao atualizar o usuário")
        return res.status(500).json({ message: "Erro ao atualizar o usuário" })
    }
}

const deleteUser = async (req, res) => {

    let foundUser

    try {
        const id = req?.id

        foundUser = await findUser("_id", id)

        if (!foundUser) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        req.log.warn({username: foundUser.username}, "Tentativa de exclusão da conta")

        const foundUserWords = await UserWords.find({
            userId: id
        })

        console.log("FoundUser: ",foundUserWords)

        if(foundUserWords.length){
            return res.status(401).json("Erro ao excluir usuário com palavras vinculadas")
        }

        saveUserField(foundUser, "refreshToken", "")
        await saveUser(foundUser)

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })

        const deletedUser = await deleteUserService(id)

        req.log.info({username: deletedUser.username}, "Conta excluída com sucesso")
        return res.status(200).json({ message: `Usuário ${deletedUser.username} deleted` })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao deletar o usuário")
    
        return res.status(500).json({ message: "Erro ao excluir usuário" })
    }
}

const deleteUserWords = async (req, res) => {

    try {
        const { categories } = req.validatedData
        const userId = req?.id

        const deletedWords = await UserWords.deleteMany({
            userId,
            tags: { $in: categories }
        })


        return res.status(200).json({ message: "Lista de palavras limpa", deletedCount: deletedWords.deletedCount })
    } catch (err) {
        return res.status(500).json({ message: "Erro ao excluir as palavras do usuário" })
    }
}

module.exports = {
    createNewUser,
    updateUser,
    deleteUser,
    validateEmail,
    resendVerificationEmail,
    deleteUserWords
}