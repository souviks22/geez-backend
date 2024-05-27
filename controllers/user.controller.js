import { User } from "../models/User.js"
import { catchAsync } from "../errors/async.js"

import jwt from "jsonwebtoken"

process.loadEnvFile()
const EXPIRATION_TIME = '7d'

export const signupHandler = catchAsync(async (req, res) => {
    const { id, name, email, image } = req.body
    const user = new User({ id, name, email, image })
    await user.save()
    const accessToken = jwt.sign({ id }, process.env.NEXTAUTH_SECRET, { expiresIn: EXPIRATION_TIME })
    res.status(201).json({
        success: true,
        message: 'We are pleased to have you.',
        data: { accessToken }
    })
})

export const signinHandler = catchAsync(async (req, res) => {
    const { id } = req.body
    const accessToken = jwt.sign({ id }, process.env.NEXTAUTH_SECRET, { expiresIn: EXPIRATION_TIME })
    res.status(201).json({
        success: true,
        message: 'We are obliged you are here.',
        data: { accessToken }
    })
})

export const getUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    const { name, email, image } = await User.findOne({ id: userId })
    res.status(200).json({
        success: true,
        message: 'Your information is secured with us.',
        data: { user: { name, email, image } }
    })
})

export const updateUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    const { update } = req.body
    const { name, email, image } = await User.findOneAndUpdate({ id: userId }, update, {
        runValidators: true,
        new: true
    })
    res.status(200).json({
        success: true,
        message: 'Your changes are saved.',
        data: { user: { name, email, image } }
    })
})

export const deleteUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    await User.findOneAndDelete({ id: userId })
    res.status(200).json({
        success: true,
        message: 'We are sorry to let you go.'
    })
})