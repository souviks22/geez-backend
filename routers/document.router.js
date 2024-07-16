import { Router } from "express"
import { body } from "express-validator"
import { getDocumentHandler, newDocumentHandler, updateDocumentHandler, deleteDocumentHandler } from "../controllers/document.controller.js"
import { isDocPresent, isUpdatable, permissionChecker } from "../middlewares/document.middleware.js"
import { isAuthenticated } from "../middlewares/user.middleware.js"

export const documentRouter = Router()

documentRouter.get('/:docId',
    isDocPresent,
    permissionChecker('viewer'),
    getDocumentHandler
)

documentRouter.post('/new-doc',
    isAuthenticated,
    newDocumentHandler
)

documentRouter.put('/:docId',
    body('update').exists(),
    isDocPresent,
    isAuthenticated,
    isUpdatable,
    permissionChecker('editor'),
    updateDocumentHandler
)

documentRouter.delete('/:docId',
    isDocPresent,
    isAuthenticated,
    permissionChecker('owner'),
    deleteDocumentHandler
)