const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const verifyToken = async (req, res, next) => {
    const token = req.headers.token
    if (token) {
        const accessToken = token.split(' ')[1]
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, async (err, user) => {
            if (err) {
                return res.status(403).json('Token is not invalid')
            }

            req.user = await User.findById(user.id).select('-password')
            next()
        })
    }
    else {
        return res.status(401).json('You are not authenticated')
    }
}
module.exports = verifyToken