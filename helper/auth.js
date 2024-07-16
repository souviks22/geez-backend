import jwt from "jsonwebtoken"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

export const getUserObjectId = req => {
  const { token } = req.cookies
  if (!token) throw new Error('Missing authorization details.')
  const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
  return _id
}