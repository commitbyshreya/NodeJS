const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// GET -> /user/register
const loadRegister = asyncHandler(async (req, res) => {
  const render = res.render("register");
  if (!render) {
    console.log("Error loading page");
  }
});

// POST - /user/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const image = req.file ? req.file.filename : null;

  //   if (!name || !email || !phone || !password || !image) {
  //     return res.status(400).json({ message: "All fields are required" });
  //   }

  //hashedpassword
  const hashedpassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    image,
    password: hashedpassword,
    isAdmin: 0,
  });

  if (user) {
    res.render("register", {
      message: "registeration successful! Please Verify your email",
    });
    req.message = null;
  } else {
    res.render("register", { message: "Your registeration failed!" });
  }
});

module.exports = { loadRegister, registerUser };
