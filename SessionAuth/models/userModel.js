const { MongoDriverError } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin :{
    type: Number,
    required: true
    },
    isVerified: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Users", userSchema)