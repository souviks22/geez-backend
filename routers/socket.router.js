import ShareDBServer from "sharedb"
import ShareDbMongo from "sharedb-mongo"
import WebSocketJSONStream from "@teamwork/websocket-json-stream"

import { slateType } from "slate-ot"
import { parse } from "url"
import { isDocPresent, isAuthorized } from "../middlewares/socket.middleware.js"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

ShareDBServer.types.register(slateType)
const db = new ShareDbMongo(process.env.DB_URL)
const otServer = new ShareDBServer({
  db, presence: true,
  doNotForwardSendPresenceErrorsToClient: true
})

otServer.use('connect', isDocPresent)
otServer.use('connect', isAuthorized)

export const socketRouter = wsServer => {
  wsServer.on('connection', (socket, request) => {
    try {
      const { docId, role, token } = parse(request.url, true).query
      if (!docId || !role || !token || token === 'undefined') throw new Error('Connection specifications are incomplete.')
      request.query = { docId, role, token }
      const stream = new WebSocketJSONStream(socket)
      otServer.listen(stream, request)
    } catch (error) {
      socket.close(1011, error.message)
    }
  })
  wsServer.on('error', console.error)
}