require('dotenv').config()

const { findUser, saveUserField, saveUser } = require('./userServices.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function loginService({ username, password }) {
    const foundUser = await findUser("username", username)

    if (!foundUser) throw new Error("INVALID_CREDENTIALS")

    const match = await matchPassword(password, foundUser)

    if (!match) throw new Error("INVALID_CREDENTIALS")

    const accessToken = createAccessToken(foundUser)

    const newRefreshToken = createRefreshToken(foundUser)

    saveUserField(foundUser, "refreshToken", newRefreshToken)
    await saveUser(foundUser)

    return { accessToken, newRefreshToken }
}

async function matchPassword(password, user) {
    const match = await bcrypt.compare(password, user.password)

    return match
}

function createAccessToken(foundUser) {
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "username": foundUser.username,
                "emailVerified": foundUser.emailVerified,
                "email": foundUser.email
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    )

    return accessToken
}

function createRefreshToken(foundUser) {
    const refreshToken = jwt.sign(
        { "id": foundUser._id, "tokenVersion": foundUser.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    )

    return refreshToken
}

async function saveRefreshToken(foundUser, refreshToken) {
    foundUser.refreshToken = refreshToken
    await foundUser.save()
}

module.exports = {
    loginService,
    matchPassword,
    createAccessToken,
    createRefreshToken,
    saveRefreshToken
}