import { Schema, model } from "mongoose"

const emptyEditor = [
  {
    type: 'paragraph',
    children: [
      {
        text: ''
      }
    ]
  }
]

const contentSchema = new Schema({
  editor: {
    type: Schema.Types.Mixed,
    default: emptyEditor
  }
})

export const Content = model('Content', contentSchema)