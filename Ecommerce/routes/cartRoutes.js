const express = require('express')
const router = express.Router()
const validateToken = require('../middleware/validateTokenHandler')
const { addToCart } = require('../controllers/cartController')

router.use(validateToken)
router.route('/add-cart').post(addToCart)

module.exports = router