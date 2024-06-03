const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const session = require('express-session')

//GET -> /user/register
const loadRegister = asyncHandler(async (req, res) => {
    res.render('register')
})

//POST -> /user/register
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    console.log(name, email, password)

    //check if user with email alredy exists
    const user = await User.findOne({ email: email })
    if (user) {
        throw new Error("User with this email is already registered!")
    }

    //hash password
    const hashedpass = await bcrypt(password, 10)

    const newUser = await User.create({
        name, 
        email,
        password: hashedpass,
    })
    if (!newUser) {
        throw new Error("user not created")
    }
    res.render('register', {message:'Please verify your email!'})
    
})

//GET -> /user/login 
const loadLogin = asyncHandler(async (req, res) => {
    res.render('login')
})

//POST -> /user/login 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    
    const user = await User.findOne({ email: email })
    if (user && (await bcrypt.compare(password, user.password))) {
        if (user.isVerified === 1) {
            const accessTokentoken =  jwt.sign({
                //passing payload (user info)
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id

                }
            }, process.env.TOKEN_SECRET, {
                expiresIn:'30m'
            })
            req.session.user_id = user._id
            res.redirect('/users/home')
        } else {
            res.render('login', {message:"Please verify your email"})
        }
    } else {
        res.render('login', {message:"Email or Password is incorrect"})
    }
})

//GET -> /user/home
const loadHome = asyncHandler(async (req, res) => {

    res.render('home')
})
module.exports = { loadRegister, registerUser , loadLogin, loginUser, loadHome}