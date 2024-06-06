const express = require('express')
const router = express.Router()
const validateToken = require('../middleware/validateTokenHandler')
const { addCategory, getCategories } = require('../controllers/categoryController')

router.use(validateToken)
router.route('/add-category').post(addCategory)
router.route('/get-cat').get(getCategories)

module.exports = router