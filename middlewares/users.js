import { User } from "../models/User.js"
import { catchAsync } from "../errors/async.js"

export const isUniqueUser = catchAsync(async (req, res, next) => {
  const { email, provider } = req.body
  const user = await User.findOne({ email, provider })
  if (user) {
    throw new Error('User with the same credentials already exists.')
  }
  next()
})

export const isUpdatable = catchAsync(async (req, res, next) => {
  const { update } = req.body
  const nonUpdatables = ['email', 'provider']
  for (const key in update) {
    for (const field of nonUpdatables) {
      if (key === field) {
        throw new Error(`You cannot change the existing ${key}.`)
      }
    }
  }
  next()
})

export const userDoesExist = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('The corresponding user does not exist.')
  }
  next()
})