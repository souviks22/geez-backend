import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"

export const getPermissionsHandler = by => {
    return catchAsync(async (req, res) => {
        const { docId, userId } = req.params
        const options = by === 'document' ? { document: docId } : { user: userId }
        const permissions = await Permission.find(options)
        res.status(200).json({
            success: true,
            message: 'Permission retrieved',
            data: { permissions }
        })
    })
}

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