import { Document } from "../models/Document.js"
import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

export const isDocPresent = catchAsync(async (req, _res, next) => {
    const { docId } = req.body
    const document = await Document.findById(docId)
    if (!document) throw new Error('The document does not exist.')
    next()
})

export const isAuthorized = catchAsync(async (req, _res, next) => {
    const { docId } = req.body
    const _id = getUserObjectId(req)
    const permission = await Permission.findOne({ user: _id, document: docId })
    if (!permission || permission.role !== 'owner') throw new Error('You are not authorized to give permission.')
    next()
})

export const isPermissionPresent = catchAsync(async (req, _res, next) => {
    const { permissionId } = req.params
    const permission = await Permission.findById(permissionId)
    if (!permission) throw new Error('This permission does not exist.')
    next()
})