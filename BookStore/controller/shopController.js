const asyncHandler = require("express-async-handler")
const path = require("path")
const rootDir = require("../util/path")
const products = require("../controller/adminController")

// / -> GET
const shopPage = asyncHandler(async (req, res) => {
    console.log('shop.js', products)
    res.sendFile(path.join(rootDir,'view', 'shop.html'))
})

module.exports = {shopPage}