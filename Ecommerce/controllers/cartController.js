const Cart = require('../models/cartModel')
const asyncHandler = require('express-async-handler')

//POST -> /api/add-cart
const addToCart = asyncHandler(async (req, res) => {
    const { product_id, price, vendor_id, store_id, user_id } = req.body

    const cart = await Cart.create({
        product_id, price, vendor_id, store_id, user_id
    })
    if (!cart) {
        res.status(400).json({message:"Cart Item not added"})
    }
    res.status(200).json({message:cart})
})

module.exports = {addToCart}