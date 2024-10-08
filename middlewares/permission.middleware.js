import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

export const isAuthorized = catchAsync(async (req, _res, next) => {
  const { permissionId } = req.params
  const docId = permissionId ? (await Permission.findById(permissionId)).document : req.body.docId
  const userId = getUserObjectId(req)
  const permission = await Permission.findOne({ user: userId, document: docId })
  if (!permission || permission.role !== 'owner') throw new Error('You are not authorized to give permission.')
  next()
})

export const isPermissionPresent = catchAsync(async (req, _res, next) => {
  const { permissionId } = req.params
  const permission = await Permission.findById(permissionId)
  if (!permission) throw new Error('This permission does not exist.')
  next()
})