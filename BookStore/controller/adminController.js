const asyncHandler = require("express-async-handler")
const path = require("path")
const rootDir = require("../util/path")

const products = []

// /admin/add-product -> GET
const addProductPage = asyncHandler(async (req, res) => {
    res.sendFile(path.join(rootDir,'view', 'add-product.html'))
})

// /admin/add-product  -> POST
const addProduct = asyncHandler(async (req, res) => {
    console.log("body: ", req.body)
    products.push({title: req.body.title})
    res.redirect('/')
})

module.exports = {addProductPage, addProduct, products}