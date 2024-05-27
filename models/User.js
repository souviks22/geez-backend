import { Schema, model } from "mongoose"

const userSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Not a valid email address.']
    },
    image: {
        type: String,
        required: true,
        match: [/\b((http[s]?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})(\/[a-zA-Z0-9&%_.-~]*)*(\?[a-zA-Z0-9&%_.-~+=]*)?)\b/, 'Not a valid image url.']
    }
})

export const User = model('User', userSchema)