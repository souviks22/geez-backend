import { Router } from "express"
import { body } from "express-validator"
import { getDocumentHandler, newDocumentHandler, updateDocumentHandler, deleteDocumentHandler } from "../controllers/document.controller.js"
import { isAuthenticated } from "../middlewares/user.middleware.js"
import { isDocPresent, isAuthorizedToChangeSettings } from "../middlewares/document.middleware.js"

export const documentRouter = Router()

documentRouter.get('/:docId',
    isDocPresent,
    getDocumentHandler
)

documentRouter.post('/new-doc',
    body('title').exists(),
    body('owner').exists(),
    isAuthenticated,
    newDocumentHandler
)

documentRouter.put('/:docId',
    body('update').exists(),
    isAuthenticated,
    isDocPresent,
    isAuthorizedToChangeSettings,
    updateDocumentHandler
)

documentRouter.delete('/:docId',
    isAuthenticated,
    isDocPresent,
    isAuthorizedToChangeSettings,
    deleteDocumentHandler
)