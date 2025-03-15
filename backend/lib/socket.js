const { Server } = require('socket.io')
const http = require('http')
const express = require('express')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})


const usersOnline = {}

function getReceiverSocketId(userId) {
    return usersOnline[userId]
}

io.on('connection', (socket) => {
    console.log('A user connected', socket.id)

    const userId = socket.handshake.query.userId
    if (userId) usersOnline[userId] = socket.id
    io.emit('getUsersOnline', Object.keys(usersOnline))

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
        delete usersOnline[userId]
        io.emit('getUsersOnline', Object.keys(usersOnline))
    })
})

module.exports = { app, io, server, getReceiverSocketId }