import { User } from "../models/User.js"
import { catchAsync } from "../errors/catch.js"

import jwt from "jsonwebtoken"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

export const isAuthenticated = (self = false) => {
  return catchAsync(async (req, _res, next) => {
    const { token } = req.cookies
    if (!token) throw new Error('Missing authorization details.')
    const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    const user = await User.findById(_id)
    if (!user) throw new Error('You are not authorized.')
    if (self) {
      const { userId } = req.params
      if (user.oauthId !== userId) throw new Error('You are not authorized.')
    }
    next()
  })
}

export const userExistenceChecker = flag => {
  return catchAsync(async (req, _res, next) => {
    const { oauthId } = req.body
    const user = await User.findOne({ oauthId })
    if (flag && !user) throw new Error('The corresponding user does not exist.')
    if (!flag && user) throw new Error('User with the same credentials already exists.')
    next()
  })
}