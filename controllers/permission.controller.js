import { User } from "../models/User.js"
import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

const order = { 'owner': 1, 'editor': 2, 'viewer': 3 }

export const getUsersOfDocumentHandler = catchAsync(async (req, res) => {
  const { docId } = req.params
  const { role } = req.query
  if (role) {
    const permissions = await Permission.find({ document: docId, role }).populate('user')
    const users = permissions.map(permission => permission.user)
    res.status(200).json({
      success: true,
      message: `Users with ${role} permission retrieved`,
      data: { users }
    })
  } else {
    const permissions = await Permission.find({ document: docId })
    const userId = getUserObjectId(req)
    permissions.sort((a, b) => order[a.role] - order[b.role])
    const index = permissions.map(permission => permission.user.toString()).indexOf(userId)
    res.status(200).json({
      success: true,
      message: `Permissions retrieved`,
      data: { permissions: [permissions[index], ...permissions.slice(0, index), ...permissions.slice(index + 1)] }
    })
  }
})

export const getDocumentsOfUserHandler = catchAsync(async (req, res) => {
  const { userId } = req.params
  const permissions = await Permission.find({ user: userId }).populate('document')
  const documents = []
  for (const permission of permissions) documents.push(permission.document)
  res.status(200).json({
    success: true,
    message: 'Documents retrieved',
    data: { documents }
  })
})

export const getSpecificPermissionHandler = catchAsync(async (req, res) => {
  const { docId, userId } = req.params
  const permission = await Permission.findOne({ document: docId, user: userId })
  res.status(200).json({
    success: true,
    message: 'Permission retrieved',
    data: { permission }
  })
})

export const newPermissionHandler = catchAsync(async (req, res) => {
  const { docId, email, role } = req.body
  const users = await User.find({ email })
  if (!users.length) throw new Error('No user exists with this email.')
  const userId = getUserObjectId(req)
  const permissions = []
  for (const user of users) {
    const existingPermission = await Permission.findOne({ document: docId, user: user._id })
    if (existingPermission) {
      if (user._id === userId) continue
      await Permission.findByIdAndUpdate(existingPermission._id, { role }, { runValidators: true })
    } else {
      const permission = new Permission({ document: docId, user: user._id, role })
      await permission.save()
      permissions.push(permission)
    }
  }
  res.status(201).json({
    success: true,
    message: 'You have given then permission',
    data: { permissions }
  })
})

export const updatePermissionHandler = catchAsync(async (req, res) => {
  const { permissionId } = req.params
  const { role } = req.body
  const permission = await Permission.findByIdAndUpdate(permissionId, { role }, { runValidators: true, new: true })
  res.status(200).json({
    success: true,
    message: 'Permission is changed.',
    data: { permission }
  })
})

export const deletePermissionHandler = catchAsync(async (req, res) => {
  const { permissionId } = req.params
  await Permission.findByIdAndDelete(permissionId)
  res.status(200).json({
    success: true,
    message: 'Permission is removed.'
  })
})