const express = require("express");
const { loadRegister , registerUser, loadLogin, loginUser, loadHome} = require("../controller/userController");
const router = express.Router();

router.route("/register").get(loadRegister).post(registerUser);
router.route('/login').get(loadLogin).post(loginUser)
router.route('/home').get(loadHome)

module.exports = router;
