const express = require('express')
const router = express.Router()
const { loadRegister, registerUser , verifyEmail, loadLogin, loginUser, loadHome, logOut, forgetLoad, verifyForget, loadForgetPass, setForgetpass} = require('../controllers/userController') 
const upload = require('../utils/multer')
const session = require('express-session')
const { isLogIn, isLogOut } = require('../middleware/auth')
const sessionConfig = require('../config/sessionConfig')

router.use(sessionConfig)
// router.route('/register').get(loadRegister).post(upload.single('image'),registerUser)

// upload.fields -> used to upload an array under the field name 'image'
router.route('/register').get(isLogOut,loadRegister).post(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), registerUser) 
router.route('/verify').get(verifyEmail)
router.route('/login').get(isLogOut,loadLogin).post(loginUser)
router.route('/home').get(isLogIn, loadHome)
router.route('/logout').get(isLogIn, logOut)
router.route('/forget').get(isLogOut,forgetLoad).post(isLogOut,verifyForget)
router.route('/forget-pass').get(isLogOut,loadForgetPass)
router.route('/forget-pass').post(isLogOut,setForgetpass)

module.exports = router