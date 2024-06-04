const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

//POST -> /user/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, type } = req.body
  const image = req.file? req.file.filename : null

  if (!name || !email || !password || !phone || !type || !image) {
    return res.status(400).json({ message: "All fields are required, including image" });
  }

  const userExiting = await User.findOne({ email: email })

  if (userExiting) {
    res.status(201).json({message: "Email already registered!"})
  }

  const hashPass = await bcrypt.hash(password, 10)
  
  const user = await User.create({
    name,email, image, phone, password: hashPass, type
  })
  if (!user) {
    throw new Error("Error creating new user")
  }
  res.status(200).json(user)
})

//POST -> /user/login
const loginUser = asyncHandler(async (req, res) => {
  
})

module.exports = {registerUser, loginUser}