const express = require('express')
const router = express.Router()
const upload = require('../utils/multerProduct')
const validateToken = require("../middleware/validateTokenHandler")
const { addProduct, getProducts, searchProduct } = require('../controllers/productController')

router.use(validateToken)
router.route('/add-prod').post(upload.array('images'), addProduct)
router.route('/get-prod').get(getProducts)
router.route('/search-prod').get(searchProduct)

module.exports = router