import ShareDB from "sharedb"
import ShareDbMongo from "sharedb-mongo"
import WebSocketJSONStream from "@teamwork/websocket-json-stream"

import { slateType } from "slate-ot"
import { isDocPresent, isAuthorized } from "../middlewares/socket.middleware.js"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

ShareDB.types.register(slateType)
const db = new ShareDbMongo(process.env.DB_URL)
const otServer = new ShareDB({
  db, presence: true,
  doNotForwardSendPresenceErrorsToClient: true
})

otServer.use('connect', isDocPresent)
otServer.use('connect', isAuthorized)

export const socketRouter = wsServer => {
  wsServer.on('connection', socket => {
    const stream = new WebSocketJSONStream(socket)
    otServer.listen(stream)
  })
  wsServer.on('error', console.error)
}