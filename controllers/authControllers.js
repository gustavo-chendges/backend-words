const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { loginService, matchPassword, createAccessToken } = require('../services/authServices')
const { findUser, saveUserField, saveUser } = require('../services/userServices')
const { sendRecover } = require('../services/emailService')

const login = async (req, res) => {
    const { username } = req.validatedData

    req.log.info({ username }, "Tentativa de login")

    try {
        const { password } = req.validatedData

        const { accessToken, newRefreshToken } = await loginService({ username, password })

        req.log.info({ username }, "Login efetuado com sucesso")

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ accessToken })
    } catch (err) {

        if (err.message === "INVALID_CREDENTIALS") {
            req.log.warn({ username }, "Nome de usuário ou senha incorretos")
            return res.status(401).json({ message: "Nome de usuário ou senha incorretos" })
        }

        req.log.error({ err, username, route: req.originalUrl, method: req.method }, "Erro ao fazer login")

        return res.status(500).json({ message: "Erro ao fazer login" })
    }
}

const passwordMatch = async (req, res) => {
    const { password } = req.validatedData

    const id = req?.id

    let foundUser

    try {

        foundUser = await findUser("_id", id)

        if (!foundUser) {
            return res.status(401).json({ message: 'Usuário ou senha incorretos' })
        }
        req.log.info({ username: foundUser.username }, "Tentativa de validação de senha")

        const match = await matchPassword(password, foundUser)

        if (!match) {
            return res.status(401).json({ message: "Usuário ou senha incorretos" })
        }

        req.log.info({ username: foundUser.username }, "Senha validada com sucesso")
        return res.status(200).json({ message: "OK" })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao validar a senha")

        return res.status(500).json({ message: "Erro ao validar a senha" })
    }

}

const refresh = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'No JWT cookies' })

    const refreshToken = cookies.jwt

    let foundUser

    try {
        foundUser = await findUser("refreshToken", refreshToken)

        if (!foundUser) return res.status(403).json({ message: 'Usuário não encontrado' })
        req.log.info({ username: foundUser.username }, "Tentativa de refresh")

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (foundUser._id.toString() !== decoded.id || foundUser.tokenVersion !== decoded.tokenVersion) {
            req.log.warn({ username: foundUser.username }, "O token de refresh expirou")
            return res.status(403).json({ message: 'Token expirou' })
        }

        const accessToken = createAccessToken(foundUser)

        return res.json({ accessToken })
    } catch (err) {

        if (
            err.name === "TokenExpiredError" ||
            err.name === "JsonWebTokenError"
        ) {

            req.log.warn(
                { username: foundUser?.username },
                "O token de refresh expirou"
            )

            return res.status(403).json({
                message: "Token expirou"
            })
        }

        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao fazer refresh")

        return res.status(500).json({ message: "Erro ao fazer refresh" })
    }
}

const logout = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(204)

    const refreshToken = cookies.jwt

    let foundUser

    try {
        foundUser = await findUser("refreshToken", refreshToken)
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true })
            return res.sendStatus(404)
        }
        req.log.info({ username: foundUser.username }, "Tentativa de logout")

        saveUserField(foundUser, "refreshToken", "")
        await saveUser(foundUser)

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })

        req.log.info({ username: foundUser.username }, "Logou efetuado com sucesso")
        return res.json({ message: 'Cookie limpo' })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao fazer logout")

        return res.status(500).json({ message: "Erro ao fazer logout" })
    }
}

const sendRecoverPasswordEmail = async (req, res) => {

    const { email } = req.validatedData

    let foundUser

    try {
        foundUser = await findUser("email", email)

        if (foundUser && foundUser.emailVerified) {
            try {
                req.log.info({ username: foundUser.username }, "Tentativa de envio de email de recuperação")
                await sendRecover(email, foundUser)
            } catch (err) {
                req.log.error({ err, username: foundUser.username, route: req.originalUrl, method: req.method }, "Erro no serviço de envio do email de recuperação")
            }
        }

        return res.status(200).json({ message: "Se o email estiver cadastrado, enviaremos um email de recuperação" })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao enviar o email de recuperação")

        return res.status(500).json({ message: "Erro ao enviar o email de recuperação" })
    }
}

const recoverPassword = async (req, res) => {
    const { email, recoverToken } = req.validatedData

    let foundUser

    try {
        foundUser = await findUser("email", email)

        if (!foundUser) {
            return res.status(400).json({ message: "Email ou código incorretos" })
        }

        req.log.info({ username: foundUser.username }, "Tentativa de recuperação de senha")

        const match = await bcrypt.compare(recoverToken, foundUser.recoverToken)

        if (!match) {
            return res.status(400).json({ message: "Email ou código incorretos" })
        }

        saveUserField(foundUser, "recoverTokenValidated", true)
        await saveUser(foundUser)

        return res.status(200).json({ message: "Código validado com sucesso" })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao validar o código de recuperação da senha")

        return res.status(500).json({ message: "Erro ao validar o código de recuperação da senha" })
    }
}

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.validatedData

    let foundUser

    try {
        foundUser = await findUser("email", email)

        if (!foundUser) {
            return res.status(401).json({ message: "Operação inválida" })
        }

        req.log.info({ username: foundUser.username }, "Tentativa de alteração d senha")

        if (!foundUser.recoverTokenValidated) {
            return res.status(401).json({ message: "O token não foi validado" })
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10)

        saveUserField(foundUser, "password", newHashedPassword)
        saveUserField(foundUser, "recoverToken", "")
        saveUserField(foundUser, "recoverTokenValidated", false)
        await saveUser(foundUser)

        req.log.info({username: foundUser.username}, "Senha alterada com sucesso")
        return res.status(200).json({ message: "Senha alterada com sucesso" })
    } catch (err) {
        req.log.error({ err, username: foundUser?.username, route: req.originalUrl, method: req.method }, "Erro ao alterar senha")

        return res.status(500).json({ message: "Erro ao alterar a senha" })
    }
}

module.exports = {
    login,
    passwordMatch,
    refresh,
    logout,
    sendRecoverPasswordEmail,
    recoverPassword,
    resetPassword
}