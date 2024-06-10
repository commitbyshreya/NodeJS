const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv").config();
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const { setTimeout } = require("timers/promises");

const app = express();

const port = process.env.PORT || 30001;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//create http server instance
const server = http.createServer(app);

//attach socket io to http server instance
const io = socketio(server);

var users = 0;
//handle socket connection
io.on("connection", (socket) => {
  console.log("User connected");
  users++;

  // socket.emit() -> emit event to only the client who has connected
  socket.emit("newUserConnect", { message: "Hi , Welcome to the chat" });
  //socket.broadcast.emit() -> emit event to all connected client except the one who initiated the event
  socket.broadcast.emit('newUserConnect', {message: users + " Users Connected!"})

  //handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
    users--;
    socket.broadcast.emit('newUserConnect', {message: users + " Users Connected!"})
  //io.sockets.emit() -> emit event to all connected clients
  // io.sockets.emit("broadcaste", { message: users + " users connected!" });
    
    socket.broadcast.emit('newUserConnect', {message: users + " Users Connected!"})
  });

  //handle custom event

  //   setTimeout(() => {
  //       // socket.send("Msg sent from server side");
  //   }, 3000);

  //CASE 1: sending custom msg from server and catching on client side
  //   socket.emit('customMsg', {msg:'Server side msg'})

  //CASE 2: sending custom msg from client side and catching on server side
  socket.on("customMsg", (data) => {
    console.log(data);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
