import { Router } from "express"
import { body } from "express-validator"
import { getDocumentHandler, newDocumentHandler, updateDocumentHandler, deleteDocumentHandler } from "../controllers/document.controller.js"

export const documentRouter = Router()

documentRouter.get('/:docId',
    getDocumentHandler
)

documentRouter.post('/new-doc',
    body('owner').exists(),
    newDocumentHandler
)

documentRouter.put('/:docId',
    body('update').exists(),
    updateDocumentHandler
)

documentRouter.delete('/:docId',
    deleteDocumentHandler
)