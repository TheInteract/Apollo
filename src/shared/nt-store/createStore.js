import { applyMiddleware, combineReducers, compose, createStore } from 'redux'

export default (client, initialState) => {
  return createStore(
    combineReducers({ apollo: client.reducer() }),
    initialState,
    compose(applyMiddleware(
      // authMiddleware,
      client.middleware()
    ))
  )
}
