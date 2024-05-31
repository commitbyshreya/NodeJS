const express = require('express')
const router = express.Router()
const { loadRegister, registerUser } = require('../controllers/userController') 
const upload = require('../utils/multer')

// router.route('/register').get(loadRegister).post(upload.single('image'),registerUser)

// upload.fields -> used to upload an array under the field name 'image'
router.route('/register').get(loadRegister).post(upload.fields([{ name: 'image', maxCount:1 }, { name:'document', maxCount: 1}]),registerUser) 

module.exports = router