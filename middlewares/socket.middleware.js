import { User } from "../models/User.js"
import { Document } from "../models/Document.js"
import { Permission } from "../models/Permission.js"
import { catchWS } from "../errors/catch.js"

import jwt from "jsonwebtoken"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

export const isDocPresent = catchWS(async (context, next) => {
  const { req } = context
  const { docId } = req.query
  const document = await Document.findById(docId)
  if (!document) throw new Error('The document does not exist.')
  next()
})

export const isAuthorized = catchWS(async (context, next) => {
  const { req } = context
  const { docId, role, token } = req.query
  const { visibility } = await Document.findById(docId)
  if (visibility === 'public' && role === 'viewer') return next()
  if (!token) throw new Error('Missing authorization details.')
  const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
  const user = await User.findById(_id)
  if (!user) throw new Error('You are not authorized.')
  const permission = await Permission.findOne({ document: docId, user: _id })
  if (!permission || (role === 'editor' && permission.role === 'viewer')) throw new Error('You are not authorized.')
  next()
})