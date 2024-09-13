import { Router } from "express"
import { body } from "express-validator"
import { signupHandler, signinHandler, getUserHandler, updateUserHandler, deleteUserHandler } from "../controllers/user.controller.js"
import { isUserPresent, isAuthenticated } from "../middlewares/user.middleware.js"
import { isUpdatableExcept } from "../middlewares/document.middleware.js"

export const userRouter = Router()

userRouter.post('/signup',
  body('oauthId').exists(),
  body('name').exists(),
  body('email').exists(),
  body('image').exists(),
  isUserPresent(false),
  signupHandler
)

userRouter.post('/signin',
  body('oauthId').exists(),
  isUserPresent(true),
  signinHandler
)

userRouter.get('/:userId',
  isAuthenticated(),
  getUserHandler
)

userRouter.put('/:userId',
  body('update').exists(),
  isAuthenticated(true),
  isUpdatableExcept('id', 'email'),
  updateUserHandler
)

userRouter.delete('/:userId',
  isAuthenticated(true),
  deleteUserHandler
)