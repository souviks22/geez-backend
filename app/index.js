import express from "express"
import mongoose from "mongoose"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"

import { Server as SocketIO } from "socket.io"
import { userRouter } from "../routers/user.router.js"
import { documentRouter } from "../routers/document.router.js"
import { socketRouter } from "../routers/socket.router.js"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Database Connected'))
    .catch(console.error)

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/users', userRouter)
app.use('/documents', documentRouter)

const server = http.createServer(app)
const io = new SocketIO(server, { cors: '*' })
socketRouter(io)

app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the API'
    })
})

app.get('*', (_req, res) => {
    res.json({
        success: false,
        message: 'No API route exists'
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is active at PORT ${process.env.PORT}`)
})