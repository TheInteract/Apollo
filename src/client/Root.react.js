import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import App from '../shared/nt-core/App.react'
import createStore from '../shared/nt-store/createStore'

const configObj = {
  server: process.env.BROWSER ? window.__CONFIG__ : require('config').server
}

const networkInterface = createNetworkInterface({
  uri: `http://${configObj.server.host}:${configObj.server.port}/graphql`,
  opts: {
    credentials: 'same-origin'
  },
})

const client = new ApolloClient({
  networkInterface: networkInterface,
  ssrForceFetchDelay: 100,
})

const store = createStore(client, window.__APOLLO_STATE__)

const Root = () => (
  <ApolloProvider store={store} client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
)

export default Root
