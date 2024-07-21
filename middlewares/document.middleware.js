import { Document } from "../models/Document.js"
import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

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
    const _id = getUserObjectId(req)
    const permission = await Permission.findOne({ document: docId, user: _id })
    if (!permission || (role === 'editor' && permission.role === 'viewer') || (role === 'owner' && permission.role !== 'owner')) {
      throw new Error('You are not authorized.')
    }
    next()
  })
}