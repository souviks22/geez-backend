import { Document } from "../models/Document.js"
import { catchSocket } from "../errors/catch.js"

const getDocumentIfExists = async docId => {
  const document = await Document.findById(docId)
  if (!document) throw new Error('The document does not exist.')
  return document
}

const isAuthorizedToRead = (socket, document) => {
  const { access, owner, sharedTo } = document
  if (access === 'private') {
    if (socket.userObjectId === owner) return true
    const shared = sharedTo.find(shared => shared.user === socket.userObjectId)
    if (!shared) return false
  }
  return true
}

const isAuthorizedToWrite = (socket, document) => {
  const { access, publicMode, owner, sharedTo } = document
  if (access === 'public') {
    if (publicMode === 'read-only') return false
  } else {
    if (socket.userObjectId === owner) return true
    const shared = sharedTo.find(shared => shared.user === socket.userObjectId)
    if (!shared || shared.mode === 'read-only') return false
  }
  return true
}

export const joinDocumentRoomHandler = catchSocket(async (socket, docId) => {
  const document = getDocumentIfExists(docId)
  if (isAuthorizedToRead(socket, document)) {
    socket.join(docId)
  } else {
    throw new Error('You are not authorized.')
  }
})

export const leaveDocumentRoomHandler = (socket, docId) => socket.leave(docId)

export const updateDocumentContentHandler = catchSocket(async (socket, docId, content) => {
  const document = await getDocumentIfExists(docId)
  if (isAuthorizedToWrite(socket, document)) {
    await Document.findByIdAndUpdate(docId, { content }, { runValidators: true })
    socket.to(docId).emit('document-content-updation', content)
  } else {
    throw new Error('You are not authorized to write.')
  }
})

export const errorHandler = (socket, error) => {
  socket.emit('error', error)
  socket.disconnect()
}