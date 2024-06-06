const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    product_id: {
        type: String,
        required:true
    },
    price: {
        type: String,
        required:true
    },
    vendor_id: {
        type: String,
        required:true
    },
    store_id: {
        type: String,
        required:true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

module.exports = mongoose.model("cart", cartSchema)