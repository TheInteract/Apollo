import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import App from '../shared/core-app/App.react'
import config from '../shared/configs'

const networkInterface = createNetworkInterface({
  uri: `http://${config.host}:${config.port}/graphql`,
  opts: {
    credentials: 'same-origin'
  }
})

const client = new ApolloClient({
  networkInterface: networkInterface
})

const Root = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
)

export default Root
