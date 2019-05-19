const http = require('http')
const express = require('express')
const path = require("path");
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "../public")));


io.on('connection', (socket) => {
    console.log("new connection")

    socket.emit("message", generateMessage('Welcome !'))
    socket.broadcast.emit("message", generateMessage("New User joined!"))

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed')
        }
        io.emit('message', generateMessage(msg))
        callback()
    })

    socket.on("sendLocation", (latlong, callback) => {
        io.emit("locationMessage", generateLocationMessage(`https://google.com/maps?q=${latlong.lat},${latlong.long}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit("message", generateMessage("User has left"))
    })
})



server.listen(port, () => {
    console.log("Server is running successfully!! in port " + port)
})


