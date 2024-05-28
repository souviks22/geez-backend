import { isAuthenticated } from "../middlewares/io.middleware.js"
import { joinDocumentRoomHandler, leaveDocumentRoomHandler, updateDocumentContentHandler, errorHandler } from "../controllers/socket.controller.js"

export const socketRouter = io => {
  io.use(isAuthenticated)
  io.on('connection', socket => {
    const forwardSocket = callback => {
      return (...parameters) => callback(socket, ...parameters)
    }
    socket.on('join-document-room', forwardSocket(joinDocumentRoomHandler))
    socket.on('leave-document-room', forwardSocket(leaveDocumentRoomHandler))
    socket.on('update-document-content', forwardSocket(updateDocumentContentHandler))
    socket.on('error', forwardSocket(errorHandler))
  })
}