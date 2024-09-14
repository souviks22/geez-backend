import { Router } from "express"
import { body } from "express-validator"
import { getSpecificPermissionHandler, getUsersOfDocumentHandler, getDocumentsOfUserHandler, newPermissionHandler, updatePermissionHandler, deletePermissionHandler } from "../controllers/permission.controller.js"
import { isAuthorized, isPermissionPresent } from "../middlewares/permission.middleware.js"
import { isAuthenticated } from "../middlewares/user.middleware.js"
import { isDocPresent } from "../middlewares/document.middleware.js"

export const permissionRouter = Router()

permissionRouter.get('/documents/:docId',
    isAuthenticated(),
    isDocPresent(),
    getUsersOfDocumentHandler
)

permissionRouter.get('/users/:userId',
    isAuthenticated(),
    getDocumentsOfUserHandler
)

permissionRouter.get('/:docId/:userId',
    isAuthenticated(),
    isDocPresent(),
    getSpecificPermissionHandler
)

permissionRouter.post('/new-permission',
    isAuthenticated(),
    body('docId').exists(),
    body('email').exists(),
    body('role').exists(),
    isDocPresent(false),
    isAuthorized,
    newPermissionHandler
)

permissionRouter.put('/:permissionId',
    isAuthenticated(),
    body('role').exists(),
    isPermissionPresent,
    isAuthorized,
    updatePermissionHandler
)

permissionRouter.delete('/:permissionId',
    isDocPresent(false),
    isPermissionPresent,
    isAuthorized,
    deletePermissionHandler
)