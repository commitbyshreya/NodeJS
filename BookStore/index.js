const express = require("express")
const dotenv = require("dotenv").config()
const path = require("path")
const exp = require("constants")
const logger = require("morgan")

const port =  process.env.PORT || 3000

const app = express()
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/admin", require("./routes/adminRoutes"))
app.use (require("./routes/shopRoutes"))
app.use((req, res) => {
    res.sendFile(path.join(__dirname,"view", "404.html"))
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})