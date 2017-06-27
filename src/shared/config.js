// @flow

export const WEB_PORT = process.env.PORT || 8000
export const WDS_PORT = 7000
export const STATIC_PATH = '/static'
// TODO: handle auto mongo connection in heroku
// export const MONGODB_URI = 'mongodb://localhost/RELAY'
export const MONGODB_URI = 'mongodb://heroku_d4fbkbsq:pqg5iugu5degkdv2j5ku8m5r0u@ds139197.mlab.com:39197/heroku_d4fbkbsq'
export const APP_NAME = 'RELAY'
export const APP_LOGO = '/src/shared/res/favicon.png'
export const APP_CONTAINER_CLASS = 'js-app'
export const APP_CONTAINER_SELECTOR = `.${APP_CONTAINER_CLASS}`
export const JSS_SSR_CLASS = 'jss-ssr'
export const JSS_SSR_SELECTOR = `.${JSS_SSR_CLASS}`

export const IO_CONNECT = 'connect'
export const IO_DISCONNECT = 'disconnect'
export const IO_CLIENT_HELLO = 'IO_CLIENT_HELLO'
export const IO_CLIENT_JOIN_ROOM = 'IO_CLIENT_JOIN_ROOM'
export const IO_SERVER_HELLO = 'IO_SERVER_HELLO'

export const STATUS_MESSAGE_CREATED = 99
export const STATUS_MESSAGE_SENT = 100
export const STATUS_MESSAGE_RECEIVED_IN_SERVER = 200
export const STATUS_MESSAGE_DELIVERED = 300
export const TYPE_MESSAGE_TEXT = 11
export const TYPE_MESSAGE_INCLUDE_ATTACHMENT = 12

export const DEFAULT_RANK = 2
export const DEFAULT_MSBN_DURATION = 30
export const DEFAULT_MSNS_DURATION = 30
export const DEFAULT_MSBN_RATIO = 0.4
export const DEFAULT_MSNS_RATIO = 0.6
export const DEFAULT_MESSAGE_TTL = 14
export const DEFAULT_RANDOM_NODE_TIME = 10

export const HTTP_OK = 200
export const HTTP_CREATED = 201
export const HTTP_NOT_FOUND = 404
export const HTTP_BAD_REQUEST = 400
export const HTTP_INTERNAL_SERVER_ERROR = 500
