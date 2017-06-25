import mongoose from 'mongoose'
import Relation from '../model/relation'

import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
} from '../../../shared/config'

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

mongoose.Promise = Promise
mongoose.set('debug', true)

exports.findAll = (req, res) => {
  Relation.find({}, (err, relation) => {
    if (err) {
      res.status(HTTP_NOT_FOUND).send(err)
    }
    res.status(HTTP_OK).json(relation)
  })
}

exports.findById = (req, res) => {
  if (req.param.id) {
    Relation.findById({ node: req.param.id }, (err, relation) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.json(relation)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No relation id')
  }
}

// function getRelations(theNode, next) {
//   Relation.find({ node: theNode }).select({ relations: 1, _id: 0 }).exec((err, relation) => {
//     if (err) {
//       return next(err)
//     }
//     return next(relation)
//   })
// }

exports.add = (req, res) => {
  if (req.body.relation) {
    if (typeof req.body.relation === 'string' || req.body.relation instanceof String) {
      req.body.relation = JSON.parse(req.body.relation)
    }
    const newRelation = new Relation(req.body.relation)
    try {
      newRelation.save((err) => {
        if (err) {
          res.send(err)
        } else {
          req.relation = newRelation
          res.status(HTTP_CREATED).json({ message: 'Relation added!' })
        }
      })
    } catch (ex) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send(ex)
    }
  }
}

exports.addMany = (req, res) => {
  if (req.body.relations) {
    if (typeof req.body.relations === 'string' || req.body.relations instanceof String) {
      req.body.relations = JSON.parse(req.body.relations)
    }
    try {
      Relation.insertMany(req.body.relations, (err, relations) => {
        if (err) {
          res.send(err)
        } else {
          res.status(HTTP_CREATED).json({ message: `${relations.length} relations added!` })
        }
      })
    } catch (ex) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send(ex)
    }
  }
}

exports.update = (req, res, next) => {
  if (req.params.id && req.body.relation) {
    if (typeof req.body.relation === 'string' || req.body.relation instanceof String) {
      req.body.relation = JSON.parse(req.body.relation)
    }
    Relation.findOneAndUpdate({ node: req.params.id }, req.body.relation,
    { new: true }, (err, relation) => {
      if (err) {
        return res.status(HTTP_NOT_FOUND).send(err)
      }
      req.relation = relation
      // res.status(HTTP_OK).json(relation)
      return next()
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No relation id')
  }
}

exports.sync = (req, res, next) => {
  if (!req.body.knownRelationsList) {
    return res.status(HTTP_BAD_REQUEST).send('No relation id')
  }
  const nodeRelations = req.body.relations
  for (let i = 0, len = nodeRelations.length; i < len; i += 1) {
    Relation.findOne({ node: nodeRelations[i].node }, (err, srvRelations) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        // Make sure the node is listed in the relations schema
        if (!srvRelations) {
          srvRelations.set(nodeRelations[i])
        }

        // Update the friends list if it is outdated
        if (nodeRelations[i].timeStamp > srvRelations.timeStamp) {
          srvRelations.friends.set(nodeRelations[i].friends)
          srvRelations.timeStamp.set(nodeRelations[i].timeStamp)
        }
        srvRelations.save((error) => {
          if (error) { res.status(HTTP_INTERNAL_SERVER_ERROR).send(error) }
        })
      }
    })
  }
  return next()
}

exports.delete = (req, res) => {
  if (req.params.id) {
    Relation.remove({
      node: req.params.id,
    }, (err) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json({ message: `Relation ${req.params.id} successfully deleted` })
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No relation id')
  }
}

// exports.graph = (req, res, next) => {
//   // if (!req.node) { return res.status(HTTP_BAD_REQUEST).json('Must specify node') }
//   // Suppose we have a collection of courses, where a document might look like
//   // `{ _id: 0, name: 'Calculus', prerequisite: 'Trigonometry'}` and
//   // `{ _id: 0, name: 'Trigonometry', prerequisite: 'Algebra' }`
//   Relation.aggregate([{ $match: { node: req.params.id } },
//     { $graphLookup: {
//       from: 'relations',
//       startWith: '[$node]',
//       connectFromField: 'relations',
//       connectToField: 'node',
//       as: 'relations',
//       maxDepth: req.node.mRank,
//       depthField: 'nodeDegree' } },
//     { $project: { _id: 0, node: 1, Friend: '$relations.node', Depth: '$relations.nodeDegree' } },
//       { $unwind: '$relations' },
//   ])
//   .then((result) => {
//     req.graph = result
//     console.log(`Graph: ${result}`)
//     return next()
//   })
//   .catch((error) => {
//     console.error('error', error)
//     return res.status(HTTP_INTERNAL_SERVER_ERROR).json(error)
//   })
//   // return res.status(HTTP_INTERNAL_SERVER_ERROR).json('Couldnt perform aggregation')
// }
// function getNeighbours(theNode, next) {
//   console.log(`Looking for ${theNode}'s neighbours`)
// // Get relations of Id
//   Relation.find({ node: theNode }).select({ relations: 1, _id: 0 })
//   .exec((error, relations) => {
//     console.log(`Node: ${theNode}, relations: ${relations}`)
//     if (error) { return error }
//     const node = theNode
//     node.relations = relations
//     console.log(`Full Node: ${node}`)
//     return next(node)
//   })
// }

// function getNeighbours(theNode, next) {
//   console.log(`Looking for ${theNode}'s neighbours`)
// // Get relations of Id
//   const promise = Relation.find({ node: theNode }).select({ relations: 1, _id: 0 }).exec()
//   promise.then((error, relations) => {
//     console.log(`Node: ${theNode}, relations: ${relations}`)
//     if (error) { return error }
//     const node = theNode
//     node.relations = relations
//     console.log(`Full Node: ${node}`)
//     return next(node)
//   })
// }

function getIds(next) {
  Relation.find({}).select({ node: 1, _id: 0 }).exec((err, nodes) => {
    // if (err) {
    //   return next(err)
    // }
    const promises = []
    const result = []
    nodes.forEach((theNode) => {
      const promise = Relation.findOne({ node: theNode.node })
      .select({ relations: 1, _id: 0 }).exec()
      promises.push(promise.then((neighbours, error) => {
        if (error) { console.error(error) }
        const fullNode = theNode
        fullNode.relations = neighbours.relations
        result.push(fullNode)
      }))
      // if (result.length === nodes.length) {
      //   console.log(`Allllll Ids:${result}`)
      //   return next(result)
    })
    Promise.all(promises).then(() => {
      console.log(`Found the following Ids: ${result}`)
      return next(result)
    })
  })
}

// function getIds(next) {
//   Relation.find({}).select({ node: 1, _id: 0 }).exec((err, nodes) => {
//     if (err) {
//       return next(err)
//     }
//     const result = []
//     console.log(`Found nodes: ${nodes}`)
//     // for (let i = nodes.length - 1; i >= 0; i -= 1) {
//     nodes.forEach((node) => {
//       console.log(`Looking for neighbours of node: ${node}`)
//       getNeighbours(node, (error, fullNode) => {
//         console.log(`Found node: ${fullNode}`)
//         if (!error) { result.push(fullNode) }
//       })
//       // try {
//       //   // Get relations of Id
//       //   Relation.find({ node: nodes[i] }).select({ relations: 1, _id: 0 })
//       //   .exec((error, relations) => {
//       //     console.log(`Node: ${nodes[i]}, relations: ${relations}`)
//       //     if (!error) {
//       //       const node = nodes[i]
//       //       node.relations = relations
//       //       console.log(`Full Node: ${node}`)
//       //       result.push(node)
//       //     }
//       //   })
//       // } catch (ex) {
//       //   console.error(ex)
//       // }
//     })
//     console.log(`All Ids:${result}`)
//     return next(result)
//   })
// }

/**
* breadth-first search from a single source
* returns hashMap of graphRelations Ordered By Degree
*/
function bfs(nodesArrayList, s, next) {
  const INFINITY = Number.MAX_SAFE_INTEGER
  let marked = []      // marked[v] = is there an s-v path
  let edgeTo = []      // edgeTo[v] = previous edge on shortest s-v path
  let distTo = []      // distTo[v] = number of edges shortest s-v path

  console.log(`BFS got the following relations: ${nodesArrayList} and the following s: ${s}`)
  // getIds((nodesArrayList) => {
  console.log(nodesArrayList)
  marked = new Array(nodesArrayList.length)
  distTo = new Array(nodesArrayList.length)
  edgeTo = new Array(nodesArrayList.length)

  // nodesArrayList.remove(NUM_OF_EDGES)
  // nodesArrayList.remove(NUM_OF_NODES)

  const graphOrderedByDegree = []

  if (nodesArrayList.indexOf(s) !== -1) {
    const q = []
    for (let i = 0; i < nodesArrayList.length; i += 1) {
      distTo[i] = INFINITY
    }
    distTo[nodesArrayList.indexOf(s)] = 0
    marked[nodesArrayList.indexOf(s)] = true
    q.push(s)

    while (!q.isEmpty()) {
      const v = q.shift()
      const vi = nodesArrayList.indexOf(v)
      const dist = distTo[vi]

      // if degree exists add it to the graphOrderedByDegree
      if (typeof graphOrderedByDegree[dist] !== 'undefined') {
        const tempList = graphOrderedByDegree[dist]
        tempList.add(v)
        graphOrderedByDegree[dist] = tempList
      } else {
        const tempList = new Set()
        tempList.add(v)
        // graphOrderedByDegree.push({ dist, tempList })
        graphOrderedByDegree[dist] = tempList
      }

      // const neighbours = module.exports.getRelations(v)
      // for (let i = 0; i < neighbours.length; i += 1) {
      //   const w = neighbours[i].relations
      //   if (nodesArrayList.contains(w)) { // Ignore relations of nodes that aren't in nodeDB
      //     if (!marked[nodesArrayList.indexOf(w)]) {
      //       edgeTo[nodesArrayList.indexOf(w)] = nodesArrayList.indexOf(v)
      //       distTo[nodesArrayList.indexOf(w)] = distTo[nodesArrayList.indexOf(v)] + 1
      //       marked[nodesArrayList.indexOf(w)] = true
      //       q.add(w)
      //     }
      //   }
      // }
      const neighbours = nodesArrayList[vi].relations
      for (let i = 0; i < neighbours.length; i += 1) {
        const w = neighbours[i]
        if (nodesArrayList.contains(w)) { // Ignore relations of nodes that aren't in nodeDB
          if (!marked[nodesArrayList.indexOf(w)]) {
            edgeTo[nodesArrayList.indexOf(w)] = nodesArrayList.indexOf(v)
            distTo[nodesArrayList.indexOf(w)] = distTo[nodesArrayList.indexOf(v)] + 1
            marked[nodesArrayList.indexOf(w)] = true
            q.add(w)
          }
        }
      }
    }
  }
  // Turn sets to array
  for (let i; i < graphOrderedByDegree.length; i += 1) {
    graphOrderedByDegree[i] = [...graphOrderedByDegree[i]]
  }
  return next(graphOrderedByDegree)
  // })
}

function indexOfProperty(myArray, searchTerm, property) {
  for (let i = 0, len = myArray.length; i < len; i += 1) {
    if (myArray[i][property] === searchTerm) return i
  }
  return -1
}

exports.knownRelations = (req, res, next) => {
  getIds((nodesArrayList) => {
    if (nodesArrayList) {
      const nodeIndex = indexOfProperty(nodesArrayList, req.param.id, 'node')
      console.log(`nodeIndex: ${nodeIndex}`)
      bfs(nodesArrayList, nodesArrayList[nodeIndex],
      (graphRelations) => {
        if (graphRelations === [] || graphRelations === null) {
          return next()
        }
        console.log(`Known relations list:\n${graphRelations}`)
        req.knownRelationsList = graphRelations
        return next(graphRelations)
      })
    }
  })
  // const graphRelations = module.exports.bfs(module.exports
  // .getRelations(req.param.id), req.param.id)
  // if (graphRelations === [] || graphRelations === null) {
  //   return next()
  // }
  // console.log(`Known relations list:\n${graphRelations}`)
  // req.knownRelationsList = graphRelations
  // return next(graphRelations)
}
