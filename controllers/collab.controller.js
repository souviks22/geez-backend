import { Liveblocks } from "@liveblocks/node"
import { User } from "../models/User.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

process.env.NODE_ENV !== 'production' && process.loadEnvFile()

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET
})

export const liveblocksAuthHandler = catchAsync(async (req, res) => {
    const userId = getUserObjectId(req)
    const options = {}
    if (userId) {
        const user = await User.findById(userId)
        options.name = user.name
        options.picture = user.image
    }
    const session = liveblocks.prepareSession(userId || 'PUBLIC_VIEW', options)
    const { room, role } = req.body
    session.allow(room, role === 'viewer' ? session.READ_ACCESS : session.FULL_ACCESS)
    const { status, body } = await session.authorize()
    return res.status(status).end(body)
})