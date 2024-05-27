import { Schema, model } from "mongoose"

const documentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        default: ''
    },
    access: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    publicMode: {
        type: String,
        enum: ['read-only', 'read-and-write'],
        default: 'read-only'
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