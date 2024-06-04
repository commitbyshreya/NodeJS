const express = require('express')
const { registerUser, loginUser } = require('../controllers/userController')
const router = express.Router()
const upload = require('../utils/multer')

router.route('/register').post(upload.single('image'), registerUser)
router.route('/login').post(loginUser)

module.exports = router