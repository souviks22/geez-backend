import { Document } from "../models/Document.js"

export const joinDocumentRoomHandler = (socket, { docId }) => socket.join(docId)
export const leaveDocumentRoomHandler = (socket, { docId }) => socket.leave(docId)

export const updateDocumentContentHandler = async (socket, docId, content) => {
  await Document.findByIdAndUpdate(docId, { content }, { runValidators: true })
  socket.to(docId).emit('document-content-updation', content)
}