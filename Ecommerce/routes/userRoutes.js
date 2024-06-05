const express = require('express')
const { registerUser, loginUser ,homePage, updatePassword, forgetPassword, resetPassword, refreshToken} = require('../controllers/userController')
const router = express.Router()
const upload = require('../utils/multer')
const validateToken = require("../middleware/validateTokenHandler")

router.route('/forget-pass').post(forgetPassword)
router.route('/reset-pass').post(resetPassword)
router.route('/register').post(upload.single('image'), registerUser)
router.route('/login').post(loginUser)
router.use(validateToken)
router.route('/home').get(homePage)
router.route('/update-pass').post(updatePassword)
router.route('/refresh-token').post(refreshToken)


module.exports = router