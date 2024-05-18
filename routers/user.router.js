import { Router } from "express"
import { body } from "express-validator"
import { getUserHandler, newUserHandler, updateUserHandler, deleteUserHandler } from "../controllers/user.controller.js"

export const userRouter = Router()

userRouter.get('/:userId',
    getUserHandler
)

userRouter.post('/new-user',
    body('email').exists(),
    body('name').exists(),
    newUserHandler
)

userRouter.put('/:userId',
    body('update').exists(),
    updateUserHandler
)

userRouter.delete('/:userId',
    deleteUserHandler
)