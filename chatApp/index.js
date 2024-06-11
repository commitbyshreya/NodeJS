const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname,"./public/index.html"))
})

//socket connections
io.on('connection', (socket) => {
    console.log("User connected", socket.id)
    socket.on('message', (message) => {
        io.emit('incoming-msg', message)
    })

    socket.on('disconnect', () => {
        console.log("User disconnected")
    })
})

const port = 3000

server.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})