import { Document } from "../models/Document.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

export const isDocPresent = catchAsync(async (req, _res, next) => {
  const { docId } = req.params
  const document = await Document.findById(docId)
  if (!document) throw new Error('The document does not exist.')
  next()
})

export const isAuthorizedToChangeSettings = catchAsync(async (req, _res, next) => {
  const { docId } = req.params
  const _id = getUserObjectId(req)
  const { owner, sharedTo } = await Document.findById(docId)
  if (_id === owner) return next()
  const shared = sharedTo.find(shared => shared.user === _id)
  if (!shared || shared.mode !== 'co-owner') throw new Error('You are not authorized.')
  next()
})

export const isUpdatable = catchAsync(async (req, _res, next) => {
  const { update } = req.body
  const nonUpdatables = ['owner']
  for (const key in update) {
    for (const field of nonUpdatables) {
      if (key === field) {
        throw new Error(`You cannot change the existing ${key}.`)
      }
    }
  }
  next()
})

export const isPermitted = catchAsync(async (req, _res, next) => {
  const { docId } = req.params
  const { owner, access, sharedTo } = await Document.findById(docId)
  if (access === 'public') return next()
  const _id = getUserObjectId(req)
  if (_id === owner) return next()
  const shared = sharedTo.find(shared => shared.user === _id)
  if (!shared) throw new Error('You are not authorized.')
  next()
})