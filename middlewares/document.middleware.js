import { Document } from "../models/Document.js"
import { catchAsync } from "../errors/catch.js"

import jwt from "jsonwebtoken"

process.loadEnvFile()

export const isDocPresent = catchAsync(async (req, res, next) => {
  const { docId } = req.params
  const document = await Document.findById(docId)
  if (!document) throw new Error('The document does not exist.')
  next()
})

export const isAuthorizedToChangeSettings = catchAsync(async (req, res, next) => {
  const { docId } = req.params
  const { id } = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.NEXTAUTH_SECRET)
  const { owner, sharedTo } = await Document.findById(docId)
  if (id === owner) return next()
  const shared = sharedTo.find(shared => shared.user === id)
  if (!shared || shared.mode !== 'co-owner') throw new Error('You are not authorized.')
  next()
})