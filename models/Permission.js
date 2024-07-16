import { Schema, model } from "mongoose"

const permissionSchema = new Schema({
  document: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'editor', 'viewer'],
    default: 'viewer'
  }
})

export const Permission = model('Permission', permissionSchema)