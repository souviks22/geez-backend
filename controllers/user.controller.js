import { User } from "../models/User.js"
import { catchAsync } from "../errors/async.js"

export const newUserHandler = catchAsync(async (req, res) => {
    const { email, image, name } = req.body
    const username = email.split('@')[0]
    const user = new User({ name, username, email, image })
    await user.save()
    res.status(201).json({
        success: true,
        message: 'You are registered.'
    })
})