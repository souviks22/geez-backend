import { User } from "../models/User.js"
import { catchAsync } from "../errors/catch.js"

import jwt from "jsonwebtoken"

const isProduction = process.env.NODE_ENV === 'production'
!isProduction && process.loadEnvFile()

export const signupHandler = catchAsync(async (req, res) => {
    const { oauthId, name, email, image } = req.body
    const user = new User({ oauthId, name, email, image })
    await user.save()
    const { _id } = user
    const token = jwt.sign({ _id }, process.env.NEXTAUTH_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({
        success: true,
        message: 'We are pleased to have you.'
    })
})

export const signinHandler = catchAsync(async (req, res) => {
    const { oauthId } = req.body
    const { _id } = await User.findOne({ oauthId })
    const token = jwt.sign({ _id }, process.env.NEXTAUTH_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({
        success: true,
        message: 'We are obliged you are here.'
    })
})

export const getUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    const { name, email, image } = await User.findOne({ oauthId: userId })
    res.status(200).json({
        success: true,
        message: 'Your information is secured with us.',
        data: { user: { name, email, image } }
    })
})

export const updateUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    const { update } = req.body
    const { name, email, image } = await User.findOneAndUpdate({ oauthId: userId }, update, { runValidators: true, new: true })
    res.status(200).json({
        success: true,
        message: 'Your changes are saved.',
        data: { user: { name, email, image } }
    })
})

export const deleteUserHandler = catchAsync(async (req, res) => {
    const { userId } = req.params
    await User.findOneAndDelete({ oauthId: userId })
    res.status(200).json({
        success: true,
        message: 'We are sorry to let you go.'
    })
})