import { isDocPresent, isAuthorized } from "../middlewares/socket.middleware.js"
import { joinDocumentRoomHandler, leaveDocumentRoomHandler, updateDocumentContentHandler } from "../controllers/socket.controller.js"

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
    const withSocket = func => parameters => func(socket, parameters)
    socket.on('join-document-room', withSocket(joinDocumentRoomHandler))
    socket.on('leave-document-room', withSocket(leaveDocumentRoomHandler))
    socket.on('update-document-content', withSocket(updateDocumentContentHandler))
    socket.on('error', console.error)
  })

  io.on('connection_error', console.error)
}