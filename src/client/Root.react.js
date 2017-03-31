import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'

import App from '../shared/core-app/App.react'
import config from '../shared/configs'

const networkInterface = createNetworkInterface({
  uri: `http://${config.host}:${config.port}/graphql`,
  opts: {
    credentials: 'same-origin'
  },
})

const client = new ApolloClient({
  networkInterface: networkInterface,
  ssrForceFetchDelay: 100,
})

const store = createStore(
  combineReducers({ apollo: client.reducer() }),
  window.__APOLLO_STATE__,
  compose(applyMiddleware(client.middleware()))
)

const Root = () => (
  <ApolloProvider store={store} client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
)

export default Root
