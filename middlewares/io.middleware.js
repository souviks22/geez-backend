import { User } from "../models/User.js"
import { catchIO } from "../errors/catch.js"

import jwt from "jsonwebtoken"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

export const isAuthenticated = catchIO(async (socket, next) => {
  const { token } = socket.handshake.auth
  if (!token) throw new Error('Authorization token failed')
  const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
  const user = await User.findById(_id)
  if (!user) throw new Error('Authorization token failed.')
  socket.userObjectId = _id
  next()
})