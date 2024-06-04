const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//POST -> /user/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, type } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !email || !password || !phone || !type || !image) {
    return res
      .status(400)
      .json({ message: "All fields are required, including image" });
  }

  const userExiting = await User.findOne({ email: email });

  if (userExiting) {
    res.status(201).json({ message: "Email already registered!" });
  }

  const hashPass = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    image,
    phone,
    password: hashPass,
    type,
  });
  if (!user) {
    throw new Error("Error creating new user");
  }
  res.status(200).json(user);
});

//POST -> /user/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(401);
    throw new Error("User not registered");
  }

  const matchPass = await bcrypt.compare(password, user.password);
  if (!matchPass) {
    res.status(401);
    throw new Error("Login credentials are incorrect");
  }

  const accessToken = jwt.sign(
    {
      user: {
        name: user.name,
        email: user.email,
        user_id: user.id,
      },
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "30m" }
  );

  res.status(200).json({ message: "Logged In", accessToken });
});

//GET -> /user/home
const homePage = asyncHandler(async (req, res) => {
  res.json({ message: "Welcome" });
});

//POST -> /user/update-pass
const updatePassword = asyncHandler(async (req, res) => {
  const { userId, currPass, newPass } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const matchPass = await bcrypt.compare(currPass, user.password);
  if (!matchPass) {
    res.status(401);
    throw new Error("Current Password is incorrect");
  }
  const hashPass = await bcrypt.hash(newPass, 10);
  const updatePass = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: { password: hashPass } }
  );
  res.status(200).json({ message: "password updated" });
});

module.exports = { registerUser, loginUser, homePage, updatePassword };
