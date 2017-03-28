import { ApolloClient, createNetworkInterface } from 'apollo-client'
import React from 'react'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'

import App from '../../shared/core-app/App.react'
import config from '../../shared/configs'

const wdsPath = `http://${config.host}:${config.wdsPort}/build`
const assetsManifest = process.env.webpackAssets &&
  JSON.parse(process.env.webpackAssets)

export default function handleRender (req, res) {
  const context = {}
  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createNetworkInterface({
      uri: `http://${config.host}:${config.port}/graphql`,
      opts: {
        credentials: 'same-origin',
        headers: req.headers
      }
    })
  })

  const app = (
    <ApolloProvider client={client}>
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
        const initialState = { [client.reduxRootKey]: client.getInitialState() }
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
      <link
        href='https://fonts.googleapis.com/css?family=Lato'
        rel='stylesheet'
      />
      {process.env.NODE_ENV === 'production'
        ? <link rel='stylesheet' href={assetsManifest.main.css} />
        : null}
    </head>
    <body>
      <div id='root' dangerouslySetInnerHTML={{ __html: content }} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};`
        }}
      />
      {process.env.NODE_ENV === 'production'
        ? <script src={assetsManifest.main.js} />
        : <script src={wdsPath + '/main.js'} />}
    </body>
  </html>
)

Html.propTypes = {
  content: React.PropTypes.string.isRequired,
  state: React.PropTypes.object
}