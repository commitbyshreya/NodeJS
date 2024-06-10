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

//handle socket connection
io.on("connection", (socket) => {
  console.log("User connected");

//   setTimeout(() => {
//       // socket.send("Msg sent from server side");
    //   }, 3000);
    
    //CASE 1: sending custom msg from server and catching on client side
    //   socket.emit('customMsg', {msg:'Server side msg'})
    
    //CASE 2: sending custom msg from client side and catching on server side
    socket.on('customMsg', (data) => {
        console.log(data)
    })
    
    
  //handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  //handle custom event
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
