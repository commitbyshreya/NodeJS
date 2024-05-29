const express = require("express")
const router = express.Router()
const { registerUser, loginUser, currentUser, registerPage } = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")

router.route('/register').post(registerUser)
router.route('/register').get(registerPage)
router.route('/login').post(loginUser)
router.route('/current').get(validateToken,currentUser)

module.exports = router