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
        // type: Buffer, // Use Buffer type to store image data
        // required: false,
        type: String,  // use string to store on disk 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: Number,  
        required: true
    },
    
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)