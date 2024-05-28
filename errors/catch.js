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

export const catchIO = callback => {
    return (socket, next) => {
        callback(socket, next).catch(error => next(error))
    }
}

export const catchSocket = callback => {
    return (socket, ...parameter) => {
        callback(socket, ...parameter).catch(error => {
            socket.emit('error', error)
            socket.disconnect()
        })
    }
}