import {
  rules,
  sayHelloAsyncRequest,
  sayHelloAsyncSuccess,
  sayHelloAsyncFailure,
} from '../action/relay'

import helloReducer from './relay'

let helloState

beforeEach(() => {
  helloState = helloReducer(undefined, {})
})

test('handle default', () => {
  expect(helloState.get('message')).toBe('Initial reducer message')
  expect(helloState.get('messageAsync')).toBe('Initial reducer message for async call')
})

test('handle SAY_HELLO', () => {
  helloState = helloReducer(helloState, rules('Test'))
  expect(helloState.get('message')).toBe('Test')
})

test('handle SAY_HELLO_ASYNC_REQUEST', () => {
  helloState = helloReducer(helloState, sayHelloAsyncRequest())
  expect(helloState.get('messageAsync')).toBe('Loading...')
})

test('handle SAY_HELLO_ASYNC_SUCCESS', () => {
  helloState = helloReducer(helloState, sayHelloAsyncSuccess('Test async'))
  expect(helloState.get('messageAsync')).toBe('Test async')
})

test('handle SAY_HELLO_ASYNC_FAILURE', () => {
  helloState = helloReducer(helloState, sayHelloAsyncFailure())
  expect(helloState.get('messageAsync')).toBe('No message received, please check your connection')
})
