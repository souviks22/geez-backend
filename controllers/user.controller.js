import { User } from "../models/User.js"
import { Permission } from "../models/Permission.js"
import { catchAsync } from "../errors/catch.js"

import jwt from "jsonwebtoken"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

export const signupHandler = catchAsync(async (req, res) => {
  const { oauthId, name, email, image } = req.body
  const user = new User({ oauthId, name, email, image })
  await user.save()
  const { _id } = user
  const token = jwt.sign({ _id }, process.env.NEXTAUTH_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })
  res.status(201).json({
    success: true,
    message: 'We are pleased to have you.',
    data: { token, _id }
  })
})

export const signinHandler = catchAsync(async (req, res) => {
  const { oauthId } = req.body
  const { _id } = await User.findOne({ oauthId })
  const token = jwt.sign({ _id }, process.env.NEXTAUTH_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })
  res.status(201).json({
    success: true,
    message: 'We are obliged you are here.',
    data: { token, _id }
  })
})

export const getUserHandler = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { name, email, image } = await User.findById(userId)
  res.status(200).json({
    success: true,
    message: 'Your information is secured with us.',
    data: { user: { name, email, image } }
  })
})

export const updateUserHandler = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { update } = req.body
  const { name, email, image } = await User.findByIdAndUpdate(userId, update, { runValidators: true, new: true })
  res.status(200).json({
    success: true,
    message: 'Your changes are saved.',
    data: { user: { name, email, image } }
  })
})

export const deleteUserHandler = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { _id } = await User.findByIdAndDelete(userId)
  await Permission.deleteMany({ user: _id })
  res.status(200).json({
    success: true,
    message: 'We are sorry to let you go.'
  })
})