import { Router } from "express"
import { body } from "express-validator"
import { newUserHandler } from "../controllers/user.controller.js"

export const userRouter = Router()

userRouter.post('/new-user',
    body('email').exists(),
    body('image').exists(),
    body('name').exists(),
    newUserHandler
)