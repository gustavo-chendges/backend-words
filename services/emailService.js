require("dotenv").config()

const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const { createSixDigitCode } = require('./cryptoServices')

const transport = nodemailer.createTransport(
    {
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
)

async function sendEmail(to, subject, html) {
    return transport.sendMail({
        from: `LangApp <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    })
}

async function sendVerification(user) {
    const verifyToken = createSixDigitCode()

    const hashedVerifyToken = await bcrypt.hash(verifyToken.toString(), 10)

    user.verifyToken = hashedVerifyToken
    await user.save()

    await sendVerificationEmail(user.email, verifyToken)
}

async function sendVerificationEmail(email, verifyToken) {
    const html = `<div>
            <h1>Código de verificação de email</h1>
            <h2>${verifyToken}</h2>
        </div>`

    try {
        await sendEmail(email, 'Verificação de email', html)
    } catch (err) {
        console.error("Erro ao enviar email de verificação de conta", err)
        throw err
    }
}

async function sendRecover(email, user) {
    const recoverToken = createSixDigitCode()
    const hashedRecoverToken = await bcrypt.hash(recoverToken.toString(), 10)

    user.recoverToken = hashedRecoverToken
    await user.save()

    await sendPasswordRecoverEmail(email, recoverToken)
}

async function sendPasswordRecoverEmail(email, recoverToken) {
    const html = `<div>
            <h1>Código de recuperação de senha</h1>
            <h2>${recoverToken}</h2>
        </div>
        `

    try {
        await sendEmail(email, 'Recuperação de senha', html)
    } catch (err) {
        console.error("Erro ao enviar email de recuperação de senha", err)
        throw err
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordRecoverEmail,
    sendVerification,
    sendRecover
}