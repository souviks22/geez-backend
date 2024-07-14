import { Schema, model } from "mongoose"

const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const urlRegExp = /\b((http[s]?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})(\/[a-zA-Z0-9&%_.-~]*)*(\?[a-zA-Z0-9&%_.-~+=]*)?)\b/

const userSchema = new Schema({
	oauthId: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		match: [emailRegExp, 'Not a valid email address.']
	},
	image: {
		type: String,
		required: true,
		match: [urlRegExp, 'Not a valid image url.']
	}
})

export const User = model('User', userSchema)