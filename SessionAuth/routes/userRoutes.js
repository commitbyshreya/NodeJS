const express = require('express')
const router = express.Router()
const { loadRegister, registerUser } = require('../controllers/userController') 
const upload = require('../utils/multer')

router.route('/register').get(loadRegister).post(upload.single('image'),registerUser)

module.exports = router