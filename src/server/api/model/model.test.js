import mongoose from 'mongoose'
import { DEFAULT_RANK,
  STATUS_MESSAGE_CREATED,
  // STATUS_MESSAGE_SENT,
  // STATUS_MESSAGE_RECEIVED_IN_SERVER,
  // STATUS_MESSAGE_DELIVERED,
  TYPE_MESSAGE_TEXT,
  // TYPE_MESSAGE_INCLUDE_ATTACHMENT,
 } from '../../../shared/config'

require('./node')
require('./message')
require('./handshake')

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

test('Check Node Schema', () => {
  const Node = mongoose.model('nodes')
  const newNode = new Node({
    _id: '592a9e2b13928b85d225b55f',
    mId: '592a9e2b13928b85d225b55f',
    mTimeStampNodeDetails: new Date(),
    mTimeStampNodeRelations: new Date(),
    mRank: {},
    mEmail: 'a@gmail.com',
    mPhoneNumber: '050-5050505',
    mUserName: 'Moshe',
    mFullName: 'Cohen',
    mProfilePicture: {},
    mResidenceCode: {},
    mTimeStampRankFromServer: {},
  })

  expect(newNode._id).toEqual(new mongoose.Types.ObjectId('592a9e2b13928b85d225b55f'))
  expect(newNode.mRank).toBe(DEFAULT_RANK)
})

test('Check Message Schema', () => {
  const Message = mongoose.model('messages')
  const newMessage = new Message({
    _id: '592a9e2b13928b85d225b55f',
    timeCreated: new Date(),
    status: STATUS_MESSAGE_CREATED,
    senderId: String,
    destinationId: String,
    type: TYPE_MESSAGE_TEXT,
    content: 'Hello World',
    attachment: {},
  })

  expect(newMessage._id).toEqual(new mongoose.Types.ObjectId('592a9e2b13928b85d225b55f'))
  expect(newMessage.content).toBe('Hello World')
})

test('Check Handshake Schema', () => {
  const Handshake = mongoose.model('handshakes')
  const newHandshake = new Handshake({
    // mHandShakeRank: {},
    mHandShakeCounter: 2,
    mHandShakeEvents: [{ geoLocation: '2000222211', timeStamp: new Date() },
      { geoLocation: '2000222212', timeStamp: new Date() - 1 }],
  })

  expect(newHandshake.mHandShakeRank).toBe(DEFAULT_RANK)
  expect(newHandshake.mHandShakeEvents[1].geoLocation).toBe('2000222212')
})
