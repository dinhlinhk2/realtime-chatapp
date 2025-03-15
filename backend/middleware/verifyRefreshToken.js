const jwt = require('jsonwebtoken')

const veryfyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, user) => {
            if (error) {
                return res.status(403).json('refreshToken is invalid')
            }
            req.user = user
            next()
        })
    }
    else {
        return res.status(401).json('You are not authenticated')
    }
}
module.exports = veryfyRefreshToken