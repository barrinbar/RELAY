// @flow

// Web
export const HOME_PAGE_ROUTE = '/'
export const RULES_PAGE_ROUTE = '/rules'
export const HELLO_ASYNC_PAGE_ROUTE = '/hello-async'
export const NOT_FOUND_DEMO_PAGE_ROUTE = '/404'

// API
export const NODE_API_ROUTE = '/api/node'
export const GRAPH_API_ROUTE = '/api/graph'
export const RELATION_API_ROUTE = '/api/relation'
export const MESSAGE_API_ROUTE = '/api/message'
export const HANDSHAKE_API_ROUTE = '/api/handshake'
export const RULES_API_ROUTE = '/api/rules'
export const MSBN_DURATION_API_ROUTE = '/api/rules/msbnduration'
export const MSNS_DURATION_API_ROUTE = '/api/rules/msnsduration'
export const MSBN_RATIO_API_ROUTE = '/api/rules/msbnratio'
export const MSNS_RATIO_API_ROUTE = '/api/rules/msnsratio'
export const MESSAGE_TTL_API_ROUTE = '/api/rules/messagettl'
export const RANDOM_NODE_TIME_API_ROUTE = '/api/rules/randomnodetime'
export const SYNC_METADATA_API_ROUTE = '/api/sync/metadata'
export const SYNC_DATA_API_ROUTE = '/api/sync/data'

export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
