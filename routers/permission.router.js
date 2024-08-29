import { Router } from "express"
import { body } from "express-validator"
import { getUsersOfDocumentHandler, getDocumentsOfUserHandler, newPermissionHandler, updatePermissionHandler } from "../controllers/permission.controller.js"
import { isDocPresent, isAuthorized, isPermissionPresent } from "../middlewares/permission.middleware.js"
import { isAuthenticated } from "../middlewares/user.middleware.js"

export const permissionRouter = Router()

permissionRouter.get('/documents/:docId',
    isAuthenticated(),
    getUsersOfDocumentHandler
)

permissionRouter.get('/users/:userId',
    isAuthenticated(),
    getDocumentsOfUserHandler
)

permissionRouter.post('/new-permission',
    isAuthenticated(),
    body('docId').exists(),
    body('userId').exists(),
    body('role').exists(),
    isDocPresent,
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
    isDocPresent,
    isPermissionPresent,
    isAuthorized,

)