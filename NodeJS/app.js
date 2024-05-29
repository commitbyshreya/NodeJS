const express = require("express");
const path = require("path");
const logger = require("morgan");
const multer = require("multer");
const { nextTick } = require("process");
const upload = multer({ dest: "./public/uploads/" });
const router = express.Router();

const app = express();
const port = 3000 || process.env.PORT;

//Build in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse nested objects or arrays

//Static Middleware
app.use(express.static(path.join(__dirname, "public")));

//Application level middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`${new Date()} --- Request [${req.method}] [${req.url}]`);
  next();
};
app.use(loggerMiddleware);

//Third party middleware
app.use(logger("combined"));

app.use("/users", router);

const fakeAuth = (req, res, next) => {
  const authStatus = true;
  if (authStatus) {
    console.log("UserAuth status: ", authStatus);
    next();
  } else {
    res.status(401);
    throw new Error("user not authorized");
  }
};
const getUsers = (req, res) => {
  res.json({ message: "Get Users" });
};
const createUser = (req, res) => {
  console.log("Request body recieved from user: ", req.body);
  res.json({ message: " Create User" });
};

router.use(fakeAuth);

//Router level middleware
router.route("/").get(getUsers).post(createUser);

//Error handler middleware
const errhandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  switch (statusCode) {
    case 401:
      res.json({
        title: "Unauthorized user",
        message: err.message,
      });
      break;
    case 404:
      res.json({
        title: "Not Found",
        message: err.message,
      });
      break;
    case 500:
      res.json({
        title: "Server error",
        message: err.message,
      });
      break;
  }
};

app.post(
  "/upload",
  upload.single("image"),
  (req, res, next) => {
    console.log(req.file, req.body);
    res.send(req.file);
  },
  (err, req, res, next) => {
    res.status(400).send({err: err.message})
  }
);

app.all("*", (req, res) => {
  res.status(404);
  throw new Error("route not found");
});

app.use(errhandler);

app.listen(port, () => {
  console.log(`App listening on port : ${port}`);
});
