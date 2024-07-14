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
		default: ''
	},
	visibility: {
		type: String,
		enum: ['private', 'public'],
		default: 'private'
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	updatedAt: {
		type: Date,
		default: new Date()
	}
})

export const Document = model('Document', documentSchema)