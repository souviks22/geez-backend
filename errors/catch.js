import { validationResult } from "express-validator"

export const catchAsync = callback => {
    return (req, res, next) => {
        const { errors } = validationResult(req)
        if (errors.length) {
            const fields = []
            for (const error of errors) fields.push(error.path)
            res.status(400).json({
                success: false,
                message: `Missing arguments: ${fields}`
            })
        } else {
            callback(req, res, next).catch(error => {
                res.status(500).json({
                    success: false,
                    message: error.message
                })
            })
        }
    }
}
