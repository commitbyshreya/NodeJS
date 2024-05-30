const express = require("express")
const dotenv = require('dotenv').config()
const logger = require('morgan')
const dbConnect = require("./config/dbConnection")
const path = require('path');

dbConnect() 

const app = express()
const port = process.env.PORT || 3001

app.set('views', path.join(__dirname, 'views','users'));
app.set('view engine', 'ejs');
// app.set('views', './views/users')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger("dev"))

app.use('/user',require('./routes/userRoutes'))

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

