import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from '../shared/core-app/App.react'
import createStore from '../shared/store/createStore'

const store = createStore()

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

export default Root
