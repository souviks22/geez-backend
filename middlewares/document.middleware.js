import { Document } from "../models/Document.js"
import { User } from "../models/User.js"
import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"

import jwt from "jsonwebtoken"

export const isDocPresent = catchAsync(async (req, _res, next) => {
  const { docId } = req.params
  const document = await Document.findById(docId)
  if (!document) throw new Error('The document does not exist.')
  next()
})

export const updateExclusionChecker = (...immutable) => {
  return catchAsync(async (req, _res, next) => {
    const { update } = req.body
    for (const key in update) {
      for (const field of immutable) {
        if (key === field) {
          throw new Error(`You cannot change the existing ${key}.`)
        }
      }
    }
    next()
  })
}

export const permissionChecker = role => {
  return catchAsync(async (req, _res, next) => {
    const { docId } = req.params
    const { visibility } = await Document.findById(docId)
    if (visibility === 'public' && role === 'viewer') return next()
    const { authorization } = req.headers
    if (!authorization || authorization.split(' ').length !== 2) throw new Error('Missing authorization details.')
    const token = authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    const user = await User.findById(_id)
    if (!user) throw new Error('You are not authorized.')
    const permission = await Permission.findOne({ document: docId, user: _id })
    if (!permission || (role === 'editor' && permission.role === 'viewer') || (role === 'owner' && permission.role !== 'owner')) {
      throw new Error('You are not authorized.')
    }
    next()
  })
}