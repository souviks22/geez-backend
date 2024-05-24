import { Router } from "express"
import { body } from "express-validator"
import { getUserHandler, newUserHandler, updateUserHandler, deleteUserHandler } from "../controllers/user.controller.js"
import { isUniqueUser, isUpdatable, userDoesExist } from "../middlewares/users.js"
export const userRouter = Router()

userRouter.get('/:userId',
    userDoesExist,
    getUserHandler
)

userRouter.post('/new-user',
    body('name').exists(),
    body('email').exists(),
    body('image').exists(),
    body('provider').exists(),
    isUniqueUser,
    newUserHandler
)

userRouter.put('/:userId',
    body('update').exists(),
    isUpdatable,
    updateUserHandler
)

userRouter.delete('/:userId',
    userDoesExist,
    deleteUserHandler
)