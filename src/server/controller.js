// @flow

// Web Controller
export const homePage = () => null

export const rulesPage = () => ({
  rules: { message: 'Server-side preloaded message' },
})

export const helloAsyncPage = () => ({
  hello: { messageAsync: 'Server-side preloaded message for async page' },
})

export const helloEndpoint = (num: number) => ({
  serverMessage: `Hello from the server! (received ${num})`,
})

// SPI Conrtroller
export const syncServer = (num: number) => ({
  serverMessage: `Hello from the server! (received ${num})`,
})
