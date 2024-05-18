import express from "express"
import mongoose from "mongoose"
import http from "http"

import { Server as SocketIO } from "socket.io"
import { userRouter } from "../routers/user.router.js"

process.loadEnvFile()

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Database Connected'))
    .catch(console.error)

const app = express()

app.use('/users', userRouter)

const server = http.createServer(app)
const io = new SocketIO(server, { cors: '*' })

io.on('connection', socket => {
    console.log('Socket connected:', socket.id)
})

server.listen(process.env.PORT, () => console.log(`Server is active at PORT ${process.env.PORT}`))