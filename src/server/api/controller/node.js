import mongoose from 'mongoose'
import Node from '../model/node'
import rank from './rank'

import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
} from '../../../shared/config'

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

mongoose.set('debug', true)

exports.findAll = (req, res/* , next*/) => {
  Node.find({}, (err, nodes) => {
    if (err) {
      return res.status(HTTP_NOT_FOUND).send(err)
    }
    req.nodes = nodes
    return res.status(HTTP_OK).json(nodes)
    // next()
  })
}

exports.findById = (req, res, next) => {
  if (req.params.id) {
    Node.findOne({ _id: req.params.id }, (err, node) => {
      if (err) {
        return res.status(HTTP_NOT_FOUND).send(err)
      }
      req.node = node
      // res.status(HTTP_OK).json(node)
      return next()
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No node id')
  }
}

exports.add = (req, res) => {
  // if (req.body.node.mId !== ('' || null)) {
  //   req.body.node._id = req.body.node.mId
  // }
  const newNode = new Node(req.body.node)
  newNode.mRank = rank.calcRank(newNode.mId)
  newNode.mTimeStampRankFromServer = new Date()
  try {
    newNode.save((err) => {
      if (err) {
        return res.send(err)
      }
      req.node = newNode
      return res.status(HTTP_CREATED).json({ message: 'Node added!' })
    })
  } catch (ex) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).send(ex)
  }
}

exports.update = (req, res, next) => {
  if (req.params.id) {
    if (typeof req.body.node === 'string' || req.body.node instanceof String) {
      req.body.node = JSON.parse(req.body.node)
    }
    req.body.node.mRank = rank.calcRank(req.params.id)
    req.body.node.mTimeStampRankFromServer = new Date()
    Node.findOneAndUpdate({ mId: req.params.id }, req.body.node, { new: true, upsert: true },
    (err, node) => {
      if (err) {
        if (err.code === 11000) {
          // Another upsert occurred during the upsert, try again. You could omit the
          // upsert option here if you don't ever delete docs while this is running.
          Node.findOneAndUpdate({ mId: req.params.id }, req.body.node, { new: true, upsert: true },
          (error, updatednode) => {
            if (error) {
              return next(error)
            }
            req.node = updatednode
            return next()
          })
        }
      }
      req.node = node
      return next()
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No node id')
  }
}

exports.delete = (req, res) => {
  if (req.params.id) {
    Node.remove({
      mId: req.params.id,
    }, (err) => {
      if (err) {
        return res.send(err)
      }
      req.node = null
      return res.status(HTTP_OK).json({ message: `Node ${req.params.id} successfully deleted` })
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No node id')
  }
}

// exports.graph = (req, res, next) => {
//   if (!req.node) { return res.status(HTTP_BAD_REQUEST).json('Must specify node') }
//   // Suppose we have a collection of courses, where a document might look like
//   // `{ _id: 0, name: 'Calculus', prerequisite: 'Trigonometry'}` and
//   // `{ _id: 0, name: 'Trigonometry', prerequisite: 'Algebra' }`
//   Node.aggregate({ $match: { mId: req.node.id } }).graphLookup({
//     from: 'relations',
//     startWith: '$mId',
//     connectFromField: 'relations',
//     connectToField: 'node',
//     as: 'relations',
//     maxDepth: req.node.mRank,
//     depthField: 'nodeDegree' },
//     (err, result) => {
//       if (err) {
//         console.error(err)
//         return res.status(HTTP_NOT_FOUND).json('Node graph not found')
//       }
//       console.log(`Graph: ${result}`)
//       req.graph = result
//       return next()
//     }).exec()
//   console.log(`Graph: ${req.graph}`)
//   return res.status(HTTP_INTERNAL_SERVER_ERROR).json('Couldnt perform aggregation')
// }

exports.graph = (req, res, next) => {
  // if (!req.node) { return res.status(HTTP_BAD_REQUEST).json('Must specify node') }
  // Suppose we have a collection of courses, where a document might look like
  // `{ _id: 0, name: 'Calculus', prerequisite: 'Trigonometry'}` and
  // `{ _id: 0, name: 'Trigonometry', prerequisite: 'Algebra' }`
  Node.aggregate([{ $match: { node: req.params.id } },
    { $graphLookup: {
      from: 'relations',
      startWith: '$mId',
      connectFromField: 'relations',
      connectToField: 'node',
      as: 'relations',
      maxDepth: req.node.mRank,
      depthField: 'nodeDegree' } },
    { $unwind: '$relations' }])
  .then((result) => {
    req.graph = result
    console.log(`Graph: ${result}`)
    return next()
  })
  .catch((error) => {
    console.error('error', error)
    return res.status(HTTP_INTERNAL_SERVER_ERROR).json(error)
  })
  // return res.status(HTTP_INTERNAL_SERVER_ERROR).json('Couldnt perform aggregation')
}
