const express = require("express");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const connectDb = require("./config/dbConnect");
const path = require("path");

connectDb();

const port = process.env.PORT || 30001;

const app = express();
app.set("views", path.join(__dirname, "./views/users/"));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use("/user", require("./routes/userRoutes"));

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
