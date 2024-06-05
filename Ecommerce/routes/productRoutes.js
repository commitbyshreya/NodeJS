const express = require('express')
const router = express.Router()
const upload = require('../utils/multerProduct')
const validateToken = require("../middleware/validateTokenHandler")
const { addProduct } = require('../controllers/productController')

router.use(validateToken)
router.route('/add-prod').post(upload.array('images'),addProduct)

module.exports = router