import mongoose from 'mongoose'
import Message from '../model/message'

import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  // STATUS_MESSAGE_CREATED,
  // STATUS_MESSAGE_SENT,
  STATUS_MESSAGE_RECEIVED_IN_SERVER,
  STATUS_MESSAGE_DELIVERED,
  // TYPE_MESSAGE_TEXT,
  // TYPE_MESSAGE_INCLUDE_ATTACHMENT,
} from '../../../shared/config'

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

mongoose.set('debug', true)

exports.findAll = (req, res) => {
  Message.find({}, (err, message) => {
    if (err) {
      res.status(HTTP_NOT_FOUND).send(err)
    }
    res.status(HTTP_OK).json(message)
  })
}

exports.findById = (req, res) => {
  if (req.param.id) {
    Message.findById(req.params.id, (err, message) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.json(message)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No message id')
  }
}

exports.getIds = () => {
  Message.find({}).select({ mId: 1, _id: 0 }, (err, messages) => {
    if (err) {
      return err
    }
    const result = []
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      result.push(messages[i])
    }
    return result
  })
}

exports.getByNode = (node) => {
  Message.find({ mId: node }, (err, message) => {
    if (err) {
      return err
    }
    return message
  })
}

exports.getNodeMessagesIds = (node) => {
  const result = []

  // Retrieve outgoing messages
  Message.find({ mSenderId: node }).select({ mId: 1, _id: 0 }, (err, senderMsgs) => {
    if (err) { /* Do Something */ }
    for (let i = senderMsgs.length - 1; i >= 0; i -= 1) {
      result.push(senderMsgs[i])
    }
  })

  // Retrieve incoming messages
  Message.find({ mDestinationId: node }).select({ mId: 1, _id: 0 }, (err, destMsgs) => {
    if (err) { /* Do Something */ }
    for (let i = destMsgs.length - 1; i >= 0; i -= 1) {
      result.push(destMsgs[i])
    }
  })
  return result
}

exports.getNodeMessagesStatus = (node) => {
  const result = []

  // Retrieve outgoing messages
  Message.find({ mSenderId: node }).select({ mId: 1, mStatus: 1, _id: 0 }, (err, senderMsgs) => {
    if (err) { /* Do Something */ }
    for (let i = senderMsgs.length - 1; i >= 0; i -= 1) {
      const currMessage = { messageId: senderMsgs[i].mId, status: senderMsgs[i].mStatus }
      result.push(currMessage)
    }
  })

  // Retrieve incoming messages
  Message.find({ mDestinationId: node }).select({ mId: 1, mStatus: 1, _id: 0 }, (err, destMsgs) => {
    if (err) { /* Do Something */ }
    for (let i = destMsgs.length - 1; i >= 0; i -= 1) {
      const currMessage = { messageId: destMsgs[i].mId, status: destMsgs[i].mStatus }
      result.push(currMessage)
    }
  })
  return result
}

exports.add = (req, res) => {
  if (req.body.message) {
    if (typeof req.body.message === 'string' || req.body.message instanceof String) {
      req.body.message = JSON.parse(req.body.message)
    }
    const newMessage = new Message(req.body.message)
    if (req.body.message.mStatus !== ('' || null) && req.body.message.mStatus !== STATUS_MESSAGE_DELIVERED) {
      newMessage.mStatus = STATUS_MESSAGE_RECEIVED_IN_SERVER
    }
    try {
      newMessage.save((err) => {
        if (err) {
          res.send(err)
        } else {
          req.message = newMessage
          res.status(HTTP_CREATED).json({ message: 'Message added!' })
        }
      })
    } catch (ex) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send(ex)
    }
  }
}

exports.addMany = (req, res) => {
  if (req.body.messages) {
    if (typeof req.body.messages === 'string' || req.body.messages instanceof String) {
      req.body.messages = JSON.parse(req.body.messages)
    }
    try {
      Message.insertMany(req.body.messages, (err, messages) => {
        if (err) {
          res.send(err)
        } else {
          res.status(HTTP_CREATED).json({ message: `${messages.length} messages added!` })
        }
      })
    } catch (ex) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send(ex)
    }
  }
}

exports.update = (req, res) => {
  if (req.params.id) {
    if (typeof req.body.message === 'string' || req.body.message instanceof String) {
      req.body.message = JSON.parse(req.body.message)
    }
    Message.findOneAndUpdate(req.params.id, req.body.message, { new: true, upsert: true },
    (err, message) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        req.message = message
        res.status(HTTP_OK).json(message)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No message id')
  }
}

exports.syncMetadata = (req, res, next) => {
  if (!req.body.knownMessagesList) {
    return res.status(HTTP_BAD_REQUEST).send('No relation id')
  }
  // TODO: Go through all my known messages and all node known messages and perform diff
  const nodeMessages = req.body.knownMessagesList
  for (let i = 0, len = nodeMessages.length; i < len; i += 1) {
    Message.findOne({ uuid: nodeMessages[i].messageId }, (err, srvMessage) => {
      if (err) { res.status(HTTP_NOT_FOUND).send(err) }
      if (srvMessage) {
        if (nodeMessages[i].status < STATUS_MESSAGE_RECEIVED_IN_SERVER) {
          srvMessage.status.set(STATUS_MESSAGE_RECEIVED_IN_SERVER)
        } else if (nodeMessages[i].status === STATUS_MESSAGE_DELIVERED) {
          srvMessage.status.set(STATUS_MESSAGE_DELIVERED)
        }
        // TODO: If destination is e-mail guest - send to guest
        srvMessage.save((error) => {
          if (error) { res.status(HTTP_INTERNAL_SERVER_ERROR).send(error) }
        })
      }
    })
  }
  return next()
}

exports.delete = (req, res) => {
  if (req.params.id) {
    Message.remove({
      mId: req.params.id,
    }, (err) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json({ message: `Message ${req.param.id} successfully deleted` })
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No message id')
  }
}

exports.knownMessages = (req, res, next) => {
  // Make sure known relations were listed
  if (!req.knownRelationsList) {
    res.status(HTTP_INTERNAL_SERVER_ERROR)
    .json('knownRelationsList must be created before knownMessagesList')
  } else {
    const knownMessagesList = []
    const promises = []
    // Go through all node relations ranks
    req.knownRelationsList.forEach((rank) => {
      // Go through all nodes in rank
      rank.forEach((node) => {
        // Retrieve outgoing messages
        const searchList = []
        searchList.push(mongoose.Types.ObjectId(node.node))
        for (let i = 0; i < node.relations.length; i += 1) {
          searchList.push(mongoose.Types.ObjectId(node.relations[i]))
        }
        // const outPromise = Message.find({ mSenderId: mongoose.Types.ObjectId(node.node) })
        const outPromise = Message.find({ senderId: { $in: searchList } })
          .select({ uuid: 1, status: 1, _id: 0 }).exec()
        promises.push(outPromise.then((senderMsgs, err) => {
          console.log(`senderMsgs: ${senderMsgs}`)
          if (!err) {
            senderMsgs.forEach((message) => {
              console.log('Curr message:')
              console.log(message)
              if (knownMessagesList.findIndex(n => n.uuid === message.uuid) === -1) {
                // TODO: check if message exists in node known messages
                // and update status as necessary
                knownMessagesList.push(message)
              }
            })
          }
        }))

        // Retrieve incoming messages
        const inPromise = Message.find({ destinationId: { $in: searchList } })
          .select({ uuid: 1, status: 1, _id: 0 }).exec()
        promises.push(inPromise.then((destMsgs, err) => {
          if (!err) {
            destMsgs.forEach((message) => {
              if (knownMessagesList.findIndex(n => n.uuid === message.uuid) === -1) {
                // TODO: check if message exists in node known messages
                // and update status as necessary
                knownMessagesList.push(message)
              }
            })
          }
        }))
      })
    })
    Promise.all(promises).then(() => {
      console.log(`Known messages\n: ${knownMessagesList}`)
      req.knownMessagesList = knownMessagesList
      next(knownMessagesList)
    })
  }
}


// exports.knownMessages = (req, res, next) => {
//   if (!req.body.knownMessagesList || !req.body.knownRelationsList) {
//     return res.status(HTTP_BAD_REQUEST)
//     .json('knownMessagesList and knownRelationsList must be provided')
//   }
//   const allNodeRelations = this.getNodeMessagesIds
//   for (let i = 0; i < allNodeRelations.length; i += 1) {
//     const currNode = allNodeRelations[i]
//     if (req.body.knownMessagesList.indexOf(currNode) === -1) {
//       const relayMessage = relation.getByNode(currNode)
//       const destinationId = relayMessage.mDestinationId
//       const senderId = relayMessage.mSenderId

//      // if sender or destination in receivedKnownRelations(all degrees) of device, add to list
//      if ((req.body.knownRelationsList.indexOf(destinationId) != -1) ||
//          (req.body.knownRelationsList.indexOf(senderId) != -1) ||
//          newNodeIdList.containsKey(destinationId) ||
//          newNodeIdList.containsKey(senderId)) {

//          // if the sender of the msg is the sync device but he doesn't have the msg,
//          // it's means that he deleted it, therefor don't pass the msg and update it as
//          // a delivered msg
//          if (senderId.equals(receivedMetadata.getMyNode().getId()))
//              relayMessage.setStatus(RelayMessage.STATUS_MESSAGE_DELIVERED);

//          // if the message status is already delivered, delete the content of the message and
//          // send only the 'log' of the message
//          if (relayMessage.getStatus() == RelayMessage.STATUS_MESSAGE_DELIVERED){
//              relayMessage.deleteAttachment();
//              relayMessage.deleteContent();
//          }

//          // add message according to its type
//          if (relayMessage.getType() == RelayMessage.TYPE_MESSAGE_TEXT)
//              textMessagesToSend.add(relayMessage);
//          else{
//              // if the message type is object message but the attachment is's null because
//              // the message status is delivered, add the message to text message list to
//              // make the hand shake be quicker.
//              if (relayMessage.getAttachment() == null)
//                  textMessagesToSend.add(relayMessage);
//              else
//                  objectMessagesToSend.add(relayMessage);
//          }
//     }
//     }
//   }
//   return next()
// }
//   // if (graphRelations === [] || graphRelations === null) {
//   //   return next()
//   // }
//   // req.knownMessagesList = graphRelations
//   // return next(graphRelations)

