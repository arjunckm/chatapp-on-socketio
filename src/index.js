const http = require('http')
const express = require('express')
const path = require("path");
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "../public")));


io.on('connection', (socket) => {
    console.log("new connection")

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("message", generateMessage(user.username, 'Welcome !'))
        socket.broadcast.to(user.room).emit("message", generateMessage('Admin', `${user.username} has Joined`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed')
        }
        if (user) {
            io.to(user.room).emit('message', generateMessage(user.username, msg))
            callback()
        }
    })

    socket.on("sendLocation", (latlong, callback) => {
        const user = getUser(socket.id)
        if (user) {
            io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://google.com/maps?q=${latlong.lat},${latlong.long}`))
            callback()
        }

    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("message", generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})



server.listen(port, () => {
    console.log("Server is running successfully!! in port " + port)
})


