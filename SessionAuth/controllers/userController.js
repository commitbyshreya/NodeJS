const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//send link for email verification
const sendVerifyEmail = asyncHandler(async (name, email, userId) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, //gmail smtp uses 587 port for TLS/STARTTLS connections.
    secure: false,
    requireTLS: true, // ensure that the connection is encrypted.
    auth: {
      user: "shreyashedge490@gmail.com",
      pass: "ufpo xicm buco fzkz",
    },
  });
  const mailData = {
    from: "shreyashedge490@gmail.com",
    to: email,
    subject: "Email Verification",
    html:
      "<p>Hii " +
      name +
      ', Please click here to <a href="http://localhost:3000/user/verify?id=' +
      userId +
      ' "> Verify </a> your mail. </p>',
  };
  transporter.sendMail(mailData, (err) => {
    if (err) console.log(err);
    else console.log("email has been sent: ", info.response);
  });
});

//user verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const updated = await User.updateOne(
    { _id: req.query.id },
    { $set: { isVerified: 1 } }
  );
  if (!updated) {
    console.log("Erro Verifying Email");
  }
  console.log(updated);
  res.render("emailVerified");
});

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
  const documentFile =
    req.files && req.files.document ? req.files.document[0] : null;

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
    sendVerifyEmail(name, email, user._id);
    res.render("register", {
      message: "registeration successful! Please Verify your email",
    });
    req.message = null;
  } else {
    res.render("register", { message: "Your registeration failed!" });
  }
});

//GET -> /user/home
const loadHome = asyncHandler(async (req, res) => {
  res.render("home");
});

//GET -> /user/login
const loadLogin = asyncHandler(async (req, res) => {
  res.render("login");
});

//POST -> /user/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
console.log(email , password)
  const user = await User.findOne({ email: email });

  if (user) {
    const passMatch = await bcrypt.compare(password, user.password);
    if (passMatch) {
      if (user.isVerified === 1) {
        req.session.user_id = user._id
        res.redirect("/user/home");
      } else {
        res.render("login", { message: "Please verify your email" });
      }
    } else {
      res.render("login", { message: "Email and password is incorrect" });
    }
  } else {
    res.render("login", { message: "Email and password is incorrect" });
  }
});

const logOut = async(req, res) => {
  try {
    req.session.destroy()
    res.clearCookie('connect.sid'); 
    res.redirect('/user/login')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  loadRegister,
  registerUser,
  verifyEmail,
  loadLogin,
  loginUser,
  loadHome,
  logOut
};
