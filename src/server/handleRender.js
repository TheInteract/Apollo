import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'

import App from '../shared/core-app/App.react'
import config from '../shared/configs'
import createStore from '../shared/store/createStore'

const wdsPath = `http://${config.host}:${config.wdsPort}/build`

export default function handleRender (req, res) {
  const store = createStore()
  const preloadedState = store.getState()
  const context = {}

  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        <App />
      </StaticRouter>
    </Provider>
  )

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    })
    res.end()
  } else {
    res.write(renderFullPage(html, preloadedState))
    res.end()
  }
}

function renderFullPage (html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Interact</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="${wdsPath}/main.js"></script>
      </body>
    </html>
    `
}
