import { User } from "../models/User.js"
import { catchAsync } from "../errors/async.js"

export const getUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    const user = await User.findById(userId)
    res.status(200).json({
        success: true,
        message: 'Your information is secured with us.',
        data: { user }
    })
})

export const newUserHandler = catchAsync(async (req, res) => {
    const { name, email, image } = req.body
    const user = new User({ name, email, image })
    await user.save()
    res.status(201).json({
        success: true,
        message: 'We are pleased to have you.',
        data: { user }
    })
})

export const updateUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    const { update } = req.body
    const user = await User.findByIdAndUpdate(userId, update, {
        runValidators: true,
        new: true
    })
    res.status(201).json({
        success: true,
        message: 'Your changes are saved.',
        data: { user }
    })
})

export const deleteUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    await User.findByIdAndDelete(userId)
    req.status(201).json({
        success: true,
        message: 'We are sorry to let you go.'
    })
})