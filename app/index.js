import express from "express"
import mongoose from "mongoose"
import http from "http"
import cors from "cors"

import { WebSocketServer } from "ws"
import { userRouter } from "../routers/user.router.js"
import { documentRouter } from "../routers/document.router.js"
import { socketRouter } from "../routers/socket.router.js"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Database Connected'))
  .catch(console.error)

const app = express()
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000'
}))
app.use(express.json())
app.use('/users', userRouter)
app.use('/documents', documentRouter)

const server = http.createServer(app)
const wsServer = new WebSocketServer({ server })
socketRouter(wsServer)

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the API'
  })
})

app.get('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'No API route exists'
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Server is active at PORT ${process.env.PORT}`)
})