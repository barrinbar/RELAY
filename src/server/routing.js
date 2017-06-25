// @flow

import {
  homePage,
  rulesPage,
  helloAsyncPage,
  helloEndpoint,
} from './controller'

import node from './api/controller/node'
import relation from './api/controller/relation'
import message from './api/controller/message'
import handshake from './api/controller/handshake'
import rules from './api/controller/rules'
import sync from './api/controller/sync'

import {
  HOME_PAGE_ROUTE,
  RULES_PAGE_ROUTE,
  HELLO_ASYNC_PAGE_ROUTE,
  helloEndpointRoute,
  NODE_API_ROUTE,
  RELATION_API_ROUTE,
  // GRAPH_API_ROUTE,
  MESSAGE_API_ROUTE,
  HANDSHAKE_API_ROUTE,
  RULES_API_ROUTE,
  MSBN_DURATION_API_ROUTE,
  MSNS_DURATION_API_ROUTE,
  MSBN_RATIO_API_ROUTE,
  MSNS_RATIO_API_ROUTE,
  MESSAGE_TTL_API_ROUTE,
  RANDOM_NODE_TIME_API_ROUTE,
  SYNC_METADATA_API_ROUTE,
  SYNC_DATA_API_ROUTE,
} from '../shared/routes'

import {
  HTTP_OK,
  // HTTP_CREATED,
  HTTP_NOT_FOUND,
  // HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
} from '../shared/config'

import renderApp from './render-app'
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

export default (app: Object) => {
  // Restful API routes
  app.route(NODE_API_ROUTE)
      .get(node.findAll)
      .post(node.add)

  app.route(`${NODE_API_ROUTE}/:id`)
      .get(node.findById, (req, res) => res.status(HTTP_OK).json(req.node))
      .put(node.update, (req, res) => res.status(HTTP_OK).json(req.node))
      .delete(node.delete)

  app.route(MESSAGE_API_ROUTE)
      .get(message.findAll)
      .post(message.add)

  app.route(`${MESSAGE_API_ROUTE}/:id`)
      .get(message.findById, (req, res) => res.status(HTTP_OK).json(req.message))
      .put(message.update, (req, res) => res.status(HTTP_OK).json(req.message))
      .delete(message.delete)

  app.route(RELATION_API_ROUTE)
      .get(relation.findAll)
      .post(relation.add)

  app.route(`${RELATION_API_ROUTE}/:id`)
      .get(relation.findById, (req, res) => res.status(HTTP_OK).json(req.relation))
      .put(relation.update, (req, res) => res.status(HTTP_OK).json(req.relation))
      .delete(relation.delete)

  app.route(HANDSHAKE_API_ROUTE)
      .get(handshake.findAll)
      .post(handshake.add)

  app.route(`${HANDSHAKE_API_ROUTE}/:id`)
      .get(handshake.findById)
      .put(handshake.update)
      .delete(handshake.delete)

  app.route(RULES_API_ROUTE).get(rules.get)
  app.route(`${MSBN_DURATION_API_ROUTE}/:val`).put(rules.updateMSBNDuration)
  app.route(`${MSNS_DURATION_API_ROUTE}/:val`).put(rules.updateMSNSDuration)
  app.route(`${MSBN_RATIO_API_ROUTE}/:val`).put(rules.updateMSBNRatio)
  app.route(`${MSNS_RATIO_API_ROUTE}/:val`).put(rules.updateMSBNRatio)
  app.route(`${MESSAGE_TTL_API_ROUTE}/:val`).put(rules.updateMessageTTL)
  app.route(`${RANDOM_NODE_TIME_API_ROUTE}/:val`).put(rules.updateRandomNodeTime)

  // app.route(`${SYNC_METADATA_API_ROUTE}/:id`).put(sync.metadata)
  app.route(`${SYNC_METADATA_API_ROUTE}/:id`).put(
    sync.validateMetadata,
    node.update,
    relation.knownRelations,
    message.knownMessages, (req, res) => res.status(HTTP_OK).send({
      knownMessagesList: req.knownMessagesList,
      knownRelationsList: req.knownRelationsList }))
  app.route(`${SYNC_DATA_API_ROUTE}/:id`).put(sync.data)

  // Web app routes
  app.get(HOME_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, homePage()))
  })

  app.get(RULES_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, rulesPage()))
  })

  app.get(HELLO_ASYNC_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, helloAsyncPage()))
  })

  app.get(helloEndpointRoute(), (req, res) => {
    res.json(helloEndpoint(req.params.num))
  })

  app.get(`/${HTTP_INTERNAL_SERVER_ERROR}`, () => {
    throw Error('Fake Internal Server Error')
  })

  app.get('*', (req, res) => {
    res.status(HTTP_NOT_FOUND).send(renderApp(req.url))
  })

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack)
      res.status(HTTP_INTERNAL_SERVER_ERROR).send('Something went wrong!')
    }
    next()
  })
}
