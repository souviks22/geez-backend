import { Schema, model } from "mongoose"

const documentSchema = new Schema({
	title: {
		type: String,
		default: 'Untitled Document'
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		immutable: true
	},
	content: {
		type: Schema.Types.ObjectId
	},
	visibility: {
		type: String,
		enum: ['private', 'public'],
		default: 'private'
	},
	createdAt: {
		type: Date
	},
	updatedAt: {
		type: Date
	}
})

export const Document = model('Document', documentSchema)