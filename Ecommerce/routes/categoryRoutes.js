const express = require('express')
const router = express.Router()
const validateToken = require('../middleware/validateTokenHandler')
const { addCategory } = require('../controllers/categoryController')

router.use(validateToken)
router.route('/add-category').post(addCategory)

module.exports = router