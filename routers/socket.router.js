import ShareDB from "sharedb"
import ShareDbMongo from "sharedb-mongo"
import WebSocketJSONStream from "@teamwork/websocket-json-stream"

import { slateType } from "slate-ot"
import { isDocPresent, isAuthorized } from "../middlewares/socket.middleware.js"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

ShareDB.types.register(slateType)
const db = new ShareDbMongo(process.env.DB_URL)
const otServer = new ShareDB({ db, presence: true })

export const socketRouter = io => {
  io.use(isDocPresent)
  io.use(isAuthorized)

  io.on('connection', socket => {
    socket.use((_packet, next) => {
      try {
        next()
      } catch (error) {
        console.error(error.message)
        socket.emit('error', error)
      }
    })
    
    const stream = new WebSocketJSONStream(socket)
    otServer.listen(stream)
  })

  io.on('connection_error', console.error)
}