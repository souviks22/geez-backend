import { Document } from "../models/Document.js"
import { catchAsync } from "../errors/catch.js"

export const getDocumentHandler = catchAsync(async (req, res) => {
    const { docId } = req.params
    const document = await Document.findById(docId)
    res.status(200).json({
        success: true,
        message: 'Your document is here.',
        data: { document }
    })
})

export const newDocumentHandler = catchAsync(async (req, res) => {
    const { owner } = req.body
    const document = new Document({ owner })
    await document.save()
    res.status(201).json({
        success: true,
        message: 'Your document is ready.',
        data: { document }
    })
})

export const updateDocumentHandler = catchAsync(async (req, res) => {
    const { docId } = req.params
    const { update } = req.body
    const document = await Document.findByIdAndUpdate(docId, update, {
        runValidators: true,
        new: true
    })
    res.status(201).json({
        success: true,
        message: 'Your document is ready.',
        data: { document }
    })
})

export const deleteDocumentHandler = catchAsync(async (req, res) => {
    const { docId } = req.params
    await Document.findByIdAndDelete(docId)
    res.status(201).json({
        success: true,
        message: 'Your document is removed.'
    })
})