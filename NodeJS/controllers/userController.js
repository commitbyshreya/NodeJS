const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");

const registerPage = asyncHandler(async (req, res) => {
  res.sendFile(path.join(__dirname, "../", "view", "register.html"));
});

//@desc Register User
//@url POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  console.log("Body: ", req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const usernameAvailable = await User.findOne({ username });
  if (usernameAvailable) {
    res.status(400);
    throw new Error("Username is already taken!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User is already registered with this email!");
  }

  //hashed password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashedPass: ", hashedPassword);
  const user = await User.create({ username, email, password: hashedPassword });

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(200);
    throw new Error("User data not valid");
  }
});

//@desc Login User
//@url POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //if user found then match password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        //passing the payload (user info to be there in jwt token)
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: "10m" }
    );

    //set cookie with user's email
    res.cookie("userEmail", user.email, {
      httpOnly: true,
      secure: true,
      maxAge: 90000,
    });

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or PAassword is not valid!");
  }
});

//@desc Current User
//@url GET /api/user/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "current user" });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  registerPage,
};
