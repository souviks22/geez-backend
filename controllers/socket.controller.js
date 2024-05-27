import { Document } from "../models/Document.js"

export const updateDocumentBySocketHandler = socket => {
    socket.on('document-content-update', async (docId, userId, content) => {
        socket.broadcast.emit('document-content-update', content)
    })
}