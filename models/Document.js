import { Schema, model } from "mongoose"

const documentSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    access: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    sharedTo: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            mode: {
                type: String,
                enum: ['read-only', 'read-and-write', 'co-owner'],
                default: 'read-only'
            }
        }
    ]
})

export const Document = model('Document', documentSchema)