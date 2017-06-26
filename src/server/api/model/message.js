import mongoose from 'mongoose'

import {
  STATUS_MESSAGE_CREATED,
  STATUS_MESSAGE_SENT,
  STATUS_MESSAGE_RECEIVED_IN_SERVER,
  STATUS_MESSAGE_DELIVERED,
  TYPE_MESSAGE_TEXT,
  TYPE_MESSAGE_INCLUDE_ATTACHMENT,
} from '../../../shared/config'

const Schema = mongoose.Schema

const MessageSchema = new Schema({
  uuid: { type: String, unique: true },
  timeCreated: Date,
  status: { type: Number,
    enum: [STATUS_MESSAGE_CREATED,
      STATUS_MESSAGE_SENT,
      STATUS_MESSAGE_RECEIVED_IN_SERVER,
      STATUS_MESSAGE_DELIVERED],
  },
  senderId: String /* { type: mongoose.Schema.Types.ObjectId, ref: 'nodes' }*/,
  destinationId: String /* { type: mongoose.Schema.Types.ObjectId, ref: 'nodes' }*/,
  type: {
    type: Number,
    enum: [TYPE_MESSAGE_TEXT,
      TYPE_MESSAGE_INCLUDE_ATTACHMENT],
  },
  content: String,
  attachment: Buffer,
})

// module.exports = mongoose.model('Messages', MessageSchema)
module.exports = mongoose.model('messages', MessageSchema)
