const asyncHandler = require("express-async-handler")
const path = require("path")
const rootDir = require("../util/path")

// / -> GET
const shopPage = asyncHandler(async (req, res) => {
    res.sendFile(path.join(rootDir,'view', 'shop.html'))
})

module.exports = {shopPage}