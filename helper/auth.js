import jwt from "jsonwebtoken"

process.loadEnvFile()

export const getUserObjectId = req => {
  const token = req.headers['authorization'].split(' ')[1]
  const { _id } = jwt.verify(token, process.env.NEXTAUTH_SECRET)
  return _id
}