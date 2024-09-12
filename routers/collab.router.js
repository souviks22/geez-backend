import { Router } from "express"
import { body } from "express-validator"
import { isDocPresent, isAuthorized } from "../middlewares/document.middleware.js"
import { liveblocksAuthHandler } from "../controllers/collab.controller.js"

export const collabRouter = Router()

collabRouter.post('/liveblocks-auth',
    body('docId').exists(),
    body('role').exists(),
    body('room').exists(),
    isDocPresent(false),
    isAuthorized(false, false),
    liveblocksAuthHandler
)