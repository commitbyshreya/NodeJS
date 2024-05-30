const express = require("express");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const path = require("path")
const cookieParser = require("cookie-parser")

connectDb();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cookieParser)


const port = process.env.PORT || 3001;

app.use((req, res) => {
  res.sendFile(path.join(__dirname,'view','404.html'))
})
app.use("/api/contact", require("./routes/contactsRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port} `);
});
