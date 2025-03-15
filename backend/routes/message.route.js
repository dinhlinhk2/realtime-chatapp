const router = require('express').Router()
const messageController = require('../controllers/message.controller')
const verifyRefreshToken = require('../middleware/verifyRefreshToken')

router.get('/users', verifyRefreshToken, messageController.getUsersSibar)
router.get('/:id', verifyRefreshToken, messageController.getMessage)
router.post('/send/:id', verifyRefreshToken, messageController.sendMessage)
module.exports = router