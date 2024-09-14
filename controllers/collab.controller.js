import { Liveblocks } from "@liveblocks/node"
import { User } from "../models/User.js"
import { catchAsync } from "../errors/catch.js"
import { getUserObjectId } from "../helper/auth.js"

const isProduction = process.env.NODE_ENV === 'production'
!isProduction && process.loadEnvFile()
const secret = isProduction ? process.env.LIVEBLOCKS_PROD_SECRET : process.env.LIVEBLOCKS_DEV_SECRET
const liveblocks = new Liveblocks({ secret })

const colors = ['#accee2', '#c9d643', '#84c8cb', '#41760d', '#946fd8', '#9ac863', '#7ea60f', '#3a5f6c', '#bc07ee', '#5edacc']

export const liveblocksAuthHandler = catchAsync(async (req, res) => {
    const userId = getUserObjectId(req)
    const userInfo = {}
    if (userId) {
        const user = await User.findById(userId)
        userInfo.name = user.name
        userInfo.picture = user.image
        userInfo.color = colors[Math.floor(Math.random() * 10)]
    }
    const session = liveblocks.prepareSession(userId || 'PUBLIC_VIEW', { userInfo })
    const { room, role } = req.body
    session.allow(room, role === 'viewer' ? session.READ_ACCESS : session.FULL_ACCESS)
    const { status, body } = await session.authorize()
    return res.status(status).end(body)
})