import mongoose from 'mongoose'

import {
  DEFAULT_RANK,
} from '../../../shared/config'

const Schema = mongoose.Schema

// const HandShakeEventSchema = new Schema({
//   geoLocation: String,
//   timeStamp: Date,
// })

const HandShakeSchema = new Schema({
  // nodeA: { type: mongoose.Schema.Types.ObjectId, ref: 'nodes' },
  // nodeB: { type: mongoose.Schema.Types.ObjectId, ref: 'nodes' },
  handShakeRank: { type: Number, default: DEFAULT_RANK },
  handShakeCounter: { type: Number, min: 0, default: 0 },
  // handShakeEvents: [HandShakeEventSchema],
  handShakeEvents: [{ geoLocation: String, timeStamp: Date }],
})

module.exports = mongoose.model('handshakes', HandShakeSchema)
