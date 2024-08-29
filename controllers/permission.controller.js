import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"

export const getUsersOfDocumentHandler = catchAsync(async (req, res) => {
    const { docId } = req.params
    const permissions = await Permission.find({ document: docId }).populate('user')
    const users = []
    const { role } = req.query
    for (const permission of permissions) {
        if (!role || role === permission.role) users.push(permission.user)
    }
    res.status(200).json({
        success: true,
        message: 'Permission retrieved',
        data: { users }
    })
})

export const getDocumentsOfUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    const permissions = await Permission.find({ user: userId }).populate('document')
    const documents = []
    for (const permission of permissions) documents.push(permission.document)
    res.status(200).json({
        success: true,
        message: 'Permission retrieved',
        data: { documents }
    })
})

export const newPermissionHandler = catchAsync(async (req, res) => {
    const { docId, userId, role } = req.body
    const permission = new Permission({ document: docId, user: userId, role: role })
    await permission.save()
    res.status(201).json({
        success: true,
        message: 'You have given then permission',
        data: { permission }
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