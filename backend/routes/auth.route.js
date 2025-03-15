const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const verifyToken = require('../middleware/verifyToken')
const veryfyRefreshToken = require('../middleware/verifyRefreshToken')

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", veryfyRefreshToken, authController.logout);
router.put('/upload-profile', veryfyRefreshToken, authController.uploadProfile)
router.get('/checkuser', veryfyRefreshToken, authController.checkUser)
module.exports = router;
