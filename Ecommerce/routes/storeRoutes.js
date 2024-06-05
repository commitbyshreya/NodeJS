const express = require('express')
const router = express.Router()
const upload = require('../utils/multerStore')
const { createStore } = require('../controllers/storeController')
const validateToken = require('../middleware/validateTokenHandler')

router.use(validateToken)
router.route('/create-store').post(upload.single('logo'), createStore)

module.exports = router

