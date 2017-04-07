import { applyMiddleware, combineReducers, compose, createStore } from 'redux'

import RootReducer from './RootReducer'

export default (client, initialState) => {
  const store = createStore(
    RootReducer(client),
    initialState,
    compose(applyMiddleware(
      // authMiddleware,
      client.middleware()
    ))
  )

  if (module.hot) {
    module.hot.accept('./RootReducer', () => {
      const nextReducer = combineReducers(require('./RootReducer'))
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
