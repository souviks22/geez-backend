import jwt from "jsonwebtoken"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

export const getUserObjectId = req => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    return _id
  } catch (error) {
    return null
  }
}