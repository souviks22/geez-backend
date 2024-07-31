import { Schema, model } from "mongoose"

const contentSchema = new Schema({
  type: Schema.Types.Mixed
})

export const Content = model('Content', contentSchema)