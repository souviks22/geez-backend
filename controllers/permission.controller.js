import { User } from "../models/User.js"
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
    const permissions = []
    for (const user of users) {
        const existingPermission = await Permission.findOne({ document: docId, user: user._id })
        if (existingPermission) {
            if (existingPermission.role === 'owner') continue
            await Permission.findByIdAndDelete(existingPermission._id)
        }
        const permission = new Permission({ document: docId, user: user._id, role: role })
        await permission.save()
        permissions.push(permission)
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