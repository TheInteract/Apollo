import url from 'url'

import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import App from '../shared/nt-core/App.react'
import createStore from '../shared/nt-store/createStore'

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin'
  },
})

const client = new ApolloClient({
  networkInterface: networkInterface,
  ssrForceFetchDelay: 100,
  dataIdFromObject: o => o._id
})

const store = createStore(client, window.__PRELOADED_STATE__)

const Root = () => (
  <ApolloProvider store={store} client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
)

export default Root
