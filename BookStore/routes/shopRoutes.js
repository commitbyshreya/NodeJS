const express = require("express")
const router = express.Router()
const {shopPage} = require("../controller/shopController")

router.route("/").get(shopPage)

module.exports = router