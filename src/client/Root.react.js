import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

import App from '../shared/nt-core/App.react'
import config from '../shared/configs'
import createStore from '../shared/nt-store/createStore'

const wsClient = new SubscriptionClient(`ws://localhost:${config.wsPort}`, {
  reconnect: true
})

const networkInterface = createNetworkInterface({
  uri: `http://${config.host}:${config.port}/graphql`,
  opts: {
    credentials: 'same-origin'
  },
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
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
