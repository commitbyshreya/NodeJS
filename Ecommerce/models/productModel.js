const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    vendor_id: {
        type: String,
        required:true
    },
    store_id: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true
    },
    price: {
        type: String,
        required:true
    },
    category_id: {
        type: String,
        required:true
    },
    images: {
        type: Array,
        required: true,
        validate: {
            validator: function(images) {
                return images.length <= 5;
            },
            message: "Maximum of 5 images allowed"
        }
    }
},
    {
    timestamps: true
})

module.exports = mongoose.model("Products", productSchema)