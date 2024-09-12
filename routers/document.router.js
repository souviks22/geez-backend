import { Router } from "express"
import { body } from "express-validator"
import { getDocumentHandler, newDocumentHandler, updateDocumentHandler, deleteDocumentHandler } from "../controllers/document.controller.js"
import { isDocPresent, isUpdatableExcept, isAuthorized } from "../middlewares/document.middleware.js"
import { isAuthenticated } from "../middlewares/user.middleware.js"

export const documentRouter = Router()

documentRouter.get('/:docId',
	isDocPresent(),
	isAuthorized('viewer'),
	getDocumentHandler
)

documentRouter.post('/new-doc',
	isAuthenticated(),
	newDocumentHandler
)

documentRouter.put('/:docId',
	body('update').exists(),
	isDocPresent(),
	isAuthorized('editor'),
	isUpdatableExcept('owner', 'content'),
	updateDocumentHandler
)

documentRouter.delete('/:docId',
	isDocPresent(),
	isAuthorized('owner'),
	deleteDocumentHandler
)