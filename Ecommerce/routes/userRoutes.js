const express = require('express')
const { registerUser, loginUser ,homePage, updatePassword} = require('../controllers/userController')
const router = express.Router()
const upload = require('../utils/multer')
const validateToken = require("../middleware/validateTokenHandler")

router.route('/register').post(upload.single('image'), registerUser)
router.route('/login').post(loginUser)
router.use(validateToken)
router.route('/home').get(homePage)
router.route('/update-pass').post(updatePassword)

module.exports = router