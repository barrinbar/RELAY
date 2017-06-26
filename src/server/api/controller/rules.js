import mongoose from 'mongoose'
import Rule from '../model/rules'

import {
  HTTP_OK,
  // HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  // HTTP_INTERNAL_SERVER_ERROR,
} from '../../../shared/config'

mongoose.set('debug', true)

exports.findAll = (req, res/* , next*/) => {
  Rule.find({}, (err, rules) => {
    if (err) {
      return res.status(HTTP_NOT_FOUND).send(err)
    }
    req.rules = rules[0]
    return res.status(HTTP_OK).json(rules)
  })
}

// exports.add = (req, res) => {
//   const newRule = new Rule(req.body.rules)
//   try {
//     newRule.save((err) => {
//       if (err) {
//         return res.send(err)
//       }
//       req.rules = newRule
//       return res.status(HTTP_CREATED).json({ message: 'Rules added!' })
//     })
//   } catch (ex) {
//     res.status(HTTP_INTERNAL_SERVER_ERROR).send(ex)
//   }
// }

exports.updateMSBNDuration = (req, res) => {
  if (req.params.val) {
    const query = {}
    const options = { multi: true }
    Rule.update(query, { MSBNDuration: `${req.params.val}` }, options, (err, rules) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json(rules)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No rules val')
  }
}

exports.updateMSNSDuration = (req, res) => {
  if (req.params.val) {
    const query = {}
    const options = { multi: true }
    Rule.update(query, { MSNSDuration: `${req.params.val}` }, options, (err, rules) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json(rules)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No rules val')
  }
}

exports.updateMSBNRatio = (req, res) => {
  if ((req.params.val) &&
    ((Number(req.params.val).toFixed(1)) >= 0) &&
    ((Number(req.params.val).toFixed(1)) <= 1)) {
    const query = {}
    const options = { multi: true }
    Rule.update(query, { MSBNRatio: `${req.params.val}` }, options, (err, rules) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json(rules)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No rules val')
  }
}

exports.updateMSNSRatio = (req, res) => {
  if ((req.params.val) &&
    ((Number(req.params.val).toFixed(1)) >= 0) &&
    ((Number(req.params.val).toFixed(1)) <= 1)) {
    const query = {}
    const options = { multi: true }
    Rule.update(query, { MSNSRatio: `${req.params.val}` }, options, (err, rules) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json(rules)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No rules val')
  }
}

exports.updateMessageTTL = (req, res) => {
  if (req.params.val) {
    const query = {}
    const options = { multi: true }
    Rule.update(query, { MessageTTL: `${req.params.val}` }, options, (err, rules) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json(rules)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No rules val')
  }
}

exports.updateRandomNodeTime = (req, res) => {
  if (req.params.val) {
    const query = {}
    const options = { multi: true }
    Rule.update(query, { RandomNodeTime: `${req.params.val}` }, options, (err, rules) => {
      if (err) {
        res.status(HTTP_NOT_FOUND).send(err)
      } else {
        res.status(HTTP_OK).json(rules)
      }
    })
  } else {
    res.status(HTTP_BAD_REQUEST).send('No rules val')
  }
}
