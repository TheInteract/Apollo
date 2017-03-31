import 'isomorphic-fetch'

import { ApolloClient, createNetworkInterface } from 'apollo-client'
import React from 'react'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { combineReducers, createStore } from 'redux'

import App from '../../shared/core-app/App.react'
import config from '../../shared/configs'

const wdsPath = `http://${config.host}:${config.wdsPort}/build/main.js`
const assetsManifest = process.env.webpackAssets &&
  JSON.parse(process.env.webpackAssets)

export default function handleRender (req, res) {
  const context = {}

  const networkInterface = createNetworkInterface({
    uri: `http://${config.host}:${config.port}/graphql`,
    opts: {
      credentials: 'same-origin',
      headers: req.headers
    }
  })

  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: networkInterface,
  })

  const store = createStore(
    combineReducers({ apollo: client.reducer() })
  )

  const app = (
    <ApolloProvider store={store} client={client}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  )

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    })
    res.end()
  } else {
    renderToStringWithData(app)
      .then(content => {
        const initialState = { 'apollo': client.getInitialState() }
        const html = <Html content={content} state={initialState} />
        res.status(200)
        res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`)
        res.end()
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

const Html = ({ content, state }) => (
  <html>
    <head>
      <title>Interact</title>
      <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' />
      {process.env.NODE_ENV === 'production'
        ? <link rel='stylesheet' href={assetsManifest.main.css} /> : null}
    </head>
    <body>
      <div id='root' dangerouslySetInnerHTML={{ __html: content }} />
      <script dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};`
      }} />
      <script src={
        process.env.NODE_ENV === 'production' ? assetsManifest.main.js : wdsPath
      } />
    </body>
  </html>
)

Html.propTypes = {
  content: React.PropTypes.string.isRequired,
  state: React.PropTypes.object
}
