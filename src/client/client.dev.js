import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Root from './Root.react'

const mountNode = document.getElementById('root')

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    mountNode
  )
}

render(Root)

if (module.hot) {
  module.hot.accept('./Root.react', () => { render(Root) })
}
