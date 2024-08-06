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

const editorSchema = new Schema({
  children: {
    type: Schema.Types.Mixed,
    default: emptyEditor
  }
})

export const Editor = model('Editor', editorSchema)