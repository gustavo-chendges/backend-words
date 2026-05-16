const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Token')) {
        return res.status(401).json({
            message: 'Sem token de autorização'
        })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Token de acesso expirado' })

            req.id = decoded.UserInfo.id
            req.username = decoded.UserInfo.username

            next()
        }
    )
}

module.exports = verifyJWT