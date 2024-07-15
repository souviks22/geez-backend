import { Router } from "express"
import { body, cookie } from "express-validator"
import { signupHandler, signinHandler, getUserHandler, updateUserHandler, deleteUserHandler } from "../controllers/user.controller.js"
import { isUniqueUser, isUserPresent, isUpdatable, isAuthenticated, isSelfAuthorized } from "../middlewares/user.middleware.js"

export const userRouter = Router()

userRouter.post('/signup',
    body('oauthId').exists(),
    body('name').exists(),
    body('email').exists(),
    body('image').exists(),
    isUniqueUser,
    signupHandler
)

userRouter.post('/signin',
    body('oauthId').exists(),
    isUserPresent,
    signinHandler
)

userRouter.get('/:userId',
    cookie('token').exists(),
    isAuthenticated,
    getUserHandler
)

userRouter.put('/:userId',
    body('update').exists(),
    cookie('token').exists(),
    isAuthenticated,
    isSelfAuthorized,
    isUpdatable,
    updateUserHandler
)

userRouter.delete('/:userId',
    cookie('token').exists(),
    isAuthenticated,
    isSelfAuthorized,
    deleteUserHandler
)