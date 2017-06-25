import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RelationSchema = new Schema({
  node: { type: mongoose.Schema.Types.ObjectId, ref: 'nodes', unique: true, require: true },
  relations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'nodes' }],
  timeStamp: { type: Date, default: Date.Now, require: true },
})

module.exports = mongoose.model('relations', RelationSchema)
