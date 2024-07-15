import { User } from "../models/User.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

import jwt from "jsonwebtoken"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

export const isAuthenticated = catchAsync(async (req, _res, next) => {
  const { token } = req.cookies
  if (!token) throw new Error('Missing authorization details.')
  const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
  const user = await User.findById(_id)
  if (!user) throw new Error('You are not authorized.')
  next()
})

export const isUniqueUser = catchAsync(async (req, _res, next) => {
  const { oauthId } = req.body
  const user = await User.findOne({ oauthId })
  if (user) throw new Error('User with the same credentials already exists.')
  next()
})

export const isUserPresent = catchAsync(async (req, _res, next) => {
  const { oauthId } = req.body
  const user = await User.findOne({ oauthId })
  if (!user) throw new Error('The corresponding user does not exist.')
  next()
})

export const isUpdatable = catchAsync(async (req, _res, next) => {
  const { update } = req.body
  const nonUpdatables = ['id', 'email']
  for (const key in update) {
    for (const field of nonUpdatables) {
      if (key === field) {
        throw new Error(`You cannot change the existing ${key}.`)
      }
    }
  }
  next()
})

export const isSelfAuthorized = catchAsync(async (req, _res, next) => {
  const { userId } = req.params
  const _id = getUserObjectId(req)
  const { oauthId } = await User.findById(_id)
  if (oauthId !== userId) throw new Error('You are not authorized.')
  next()
})