const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

const addProduct = asyncHandler(async (req, res) => {
    const { vendor_id, store_id, price, name, category_id } = req.body
    var arrImages = []
    for (let i = 0; i < req.files.length; i++){
        arrImages[i]  = req.files? req.files[i].filename : null
    }
    const addProd = await Product.create({
        vendor_id,
        store_id,
        price,
        name,
        category_id,
        images:arrImages
    })
    if (!addProd) {
        res.status(400)
        throw new Error("Product not added")
    }
    res.status(200).json({message:"Product Added", addProd})
})


module.exports = {addProduct}