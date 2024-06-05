const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


//send link for email verification
// const sendVerifyEmail = asyncHandler(async (name, email, userId) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587, //gmail smtp uses 587 port for TLS/STARTTLS connections.
//     secure: false,
//     requireTLS: true, // ensure that the connection is encrypted.
//     auth: {
//       user: "shreyashedge490@gmail.com",
//       pass: "ufpo xicm buco fzkz",
//     },
//   });
//   const mailData = {
//     from: "shreyashedge490@gmail.com",
//     to: email,
//     subject: "Email Verification",
//     html:
//       "<p>Hii " +
//       name +
//       ', Please click here to <a href="http://localhost:3000/user/verify?id=' +
//       userId +
//       ' "> Verify </a> your mail. </p>',
//   };
//   transporter.sendMail(mailData, (err) => {
//     if (err) console.log(err);
//     else console.log("email has been sent: ", info.response);
//   });
// });

// //user verify email
// const verifyEmail = asyncHandler(async (req, res) => {
//   const updated = await User.updateOne(
//     { _id: req.query.id },
//     { $set: { isVerified: 1 } }
//   );
//   if (!updated) {
//     console.log("Erro Verifying Email");
//   }
//   console.log(updated);
//   res.render("emailVerified");
// });

const sendResetPassMail = asyncHandler(async (name, email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass:process.env.EMAIL_PASS
    }
  })
  const mailData = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: 'For Reset Password',
    html: `<p>Hello ${name}, please copy the link <a href="http://localhost:3000/user/reset-pass?token=${token}">http://localhost:3000/user/reset-pass?token=${token}</a> and reset your password.</p>`
    // html: '<p> Hello '+name+ ', please copy the link <a href= "http://localhost:3000/user/reset-pass?token='+token+' "></a> and reset your password </p>'
  }
  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.log(error.message)
    } else {
      console.log("Mail has been sent: ", info.response)
    }
  })
})

//POST -> /api/register
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
  // sendVerifyEmail(name, email, user._id);
  if (!user) {
    throw new Error("Error creating new user");
  }
  res.status(200).json(user);
});

//POST -> /api/login
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

//GET -> /api/home
const homePage = asyncHandler(async (req, res) => {
  res.json({ message: "Welcome" });
});

//POST -> /api/update-pass
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

//POST -> /api/forget-pass
const forgetPassword = asyncHandler(async (req, res) => {
  const { email }  = req.body;
  const user = await User.findOne({ email:email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const token = randomstring.generate()
  const tokenExpiration = Date.now() + 3600000 // 1 hour
  const updatePass = await User.updateOne({ email: email }, { $set: { token: token , tokenExpiration:tokenExpiration } })
  sendResetPassMail(user.name, user.email, token)
  res.status(200).json({message: "Please check your email"})
 
});

//POST -> /api/reset-pass
const resetPassword = asyncHandler(async (req, res) => {
  const token = req.query.token
  const {password} = req.body
  const tokenData = await User.findOne({ token: token })
  if (!tokenData) {
    throw new Error("Link has expired")
  }
  const hashPass = await bcrypt.hash(password,10)
  const resetPass = await User.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: hashPass, token: '' } }, { new: true })
  if (!resetPass) {
    res.status(201)
    throw new Error("Password reset Failed")
  }
  res.status(200).json({ message: "Password reset succesfull " })
  
})

module.exports = { registerUser, loginUser, homePage, updatePassword, forgetPassword, resetPassword };
