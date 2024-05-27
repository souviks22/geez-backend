import express from "express"
import mongoose from "mongoose"
import http from "http"
import cors from "cors"

import { Server as SocketIO } from "socket.io"
import { userRouter } from "../routers/user.router.js"
import { documentRouter } from "../routers/document.router.js"
import { updateDocumentBySocketHandler } from "../controllers/socket.controller.js"

process.loadEnvFile()

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Database Connected'))
    .catch(console.error)

const app = express()

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/documents', documentRouter)

const server = http.createServer(app)
const io = new SocketIO(server, { cors: '*' })
io.on('connect', socket => {
    console.log(socket.id)
    updateDocumentBySocketHandler(socket)
})
io.on('error', console.error)

server.listen(process.env.PORT, () => {
    console.log(`Server is active at PORT ${process.env.PORT}`)
})