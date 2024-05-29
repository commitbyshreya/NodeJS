const express = require("express")
const router = express.Router()
const {addProductPage, addProduct} = require("../controller/adminController")

router.route('/add-product').get(addProductPage).post(addProduct)

module.exports = router