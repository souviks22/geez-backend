import { Router } from "express"
import { body } from "express-validator"
import { signupHandler, signinHandler, getUserHandler, updateUserHandler, deleteUserHandler } from "../controllers/user.controller.js"
import { isUniqueUser, isUserPresent, isUpdatable, isAuthenticated, isSelfAuthorized } from "../middlewares/user.middleware.js"

export const userRouter = Router()

userRouter.post('/signup',
    body('id').exists(),
    body('name').exists(),
    body('email').exists(),
    body('image').exists(),
    isUniqueUser,
    signupHandler
)

userRouter.post('/signin',
    body('id').exists(),
    isUserPresent,
    signinHandler
)

userRouter.get('/:userId',
    isAuthenticated,
    getUserHandler
)

userRouter.put('/:userId',
    body('update').exists(),
    isAuthenticated,
    isSelfAuthorized,
    isUpdatable,
    updateUserHandler
)

userRouter.delete('/:userId',
    isAuthenticated,
    isSelfAuthorized,
    deleteUserHandler
)