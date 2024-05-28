import { Router } from "express"
import { body } from "express-validator"
import { getDocumentHandler, newDocumentHandler, updateDocumentHandler, deleteDocumentHandler } from "../controllers/document.controller.js"
import { isDocPresent, isAuthorizedToChangeSettings, isUpdatable, isPermitted } from "../middlewares/document.middleware.js"
import { isAuthenticated } from "../middlewares/user.middleware.js"

export const documentRouter = Router()

documentRouter.get('/:docId',
    isAuthenticated,
    isDocPresent,
    isPermitted,
    getDocumentHandler
)

documentRouter.post('/new-doc',
    body('title').exists(),
    body('content').exists(),
    isAuthenticated,
    newDocumentHandler
)

documentRouter.put('/:docId',
    body('update').exists(),
    isAuthenticated,
    isDocPresent,
    isUpdatable,
    isAuthorizedToChangeSettings,
    updateDocumentHandler
)

documentRouter.delete('/:docId',
    isAuthenticated,
    isDocPresent,
    isAuthorizedToChangeSettings,
    deleteDocumentHandler
)