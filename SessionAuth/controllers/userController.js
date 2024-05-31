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
  // const image = req.file ? req.file.buffer : null; // Memory Storage
 // const image = req.file ? req.file.image : null; // Upload.single()

  // Use Case -> when upload.fields() is used
  const imageFile = req.files && req.files.image ? req.files.image[0] : null;
  const documentFile = req.files && req.files.document ? req.files.document[0] : null;

  //hashedpassword
  const hashedpassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    //Upload.fileds()
    // imagefile.filname -> because an array is stored, this gives the filename of each file in the array 
    image: imageFile.filename,
    document: documentFile.filename,
    password: hashedpassword,
    //Upload.single()
    //image
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
