const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv").config();
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const app = express();

const port = process.env.PORT || 30001;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index2.html"));
});

const server = http.createServer(app)

const io = socketio(server)

var room_no = 1
var totalUsers = 0

io.on('connection', (socket) => {
  console.log("User connected")

  //client joined a room and channel(room) is created
  socket.join('room-' + room_no)

  io.sockets.in('room-' + room_no).emit('connectedRoom', 'You are connected to room no: ' + room_no)
  totalUsers++
 
  if (totalUsers >= 2) {
    totalUsers = 0
    room_no++
  }

  socket.on("disconnect", () => {
    console.log("User disconnected!")
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
