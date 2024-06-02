const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomString = require('randomstring')
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

//GET -> /user/logout
const logOut = async(req, res) => {
  try {
    req.session.destroy()
    res.clearCookie('connect.sid'); 
    res.redirect('/user/login')
  } catch (error) {
    console.log(error.message)
  }
}

// GET-> /user/forget
const forgetLoad = asyncHandler(async (req, res) => {
  res.render('forget')
})

//Forget password reset link
const sendResetLink = asyncHandler(async (name, email, token) => {
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
    subject: "For reset password",
    html:
      "<p>Hii " +
      name +
      ', Please click here to <a href="http://localhost:3000/user/forget-pass?token=' +
      token +
      ' "> to Reset </a> your password. </p>',
  };
  transporter.sendMail(mailData, (err) => {
    if (err) console.log(err);
    else console.log("email has been sent: ", info.response);
  });
});

//POST -> /user/forget
const verifyForget = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(email)
  const user = await User.findOne({ email: email })
  if (user) {
    if (user.isVerified === 0) {
      res.render('forget', {message: 'Please verify your email'})
    } else {
    const token = randomString.generate()
      const updated = await User.updateOne({ email: email }, { $set: { token: token } })
      sendResetLink(user.name, user.email, token)
      res.render('forget',{message: 'Check your email to reset password'})
    }
  } else {
    res.render('forget',{message: 'User email is incorrect'})
  }
})

// GET -> /user/forget-pass
const loadForgetPass = asyncHandler(async (req, res) => {
  const token = req.query.token
  const tokenData = await User.findOne({ token: token })
  if (tokenData) {
    res.render('forget-pass', {user_id : tokenData._id})
  } else {
    res.render('404', {message: "Token is invalid"})
  }
})
  
//POST -> /user/forget-pass
const setForgetpass = asyncHandler(async (req, res) => {
  const { password, user_id } = req.body
  console.log(password)
  const hashedpassword = await bcrypt.hash(password, 10)
  const updatedPassword = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: hashedpassword, token: '' } })
  res.redirect('/user/login')
})
  
module.exports = {
  loadRegister,
  registerUser,
  verifyEmail,
  loadLogin,
  loginUser,
  loadHome,
  logOut,
  forgetLoad, verifyForget, loadForgetPass, setForgetpass
};
