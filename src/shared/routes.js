import React from 'react'

import MainPage from './core-app/MainPage.react'
// import NoMatch from './core-app/NoMatch.react'

export default [
  {
    path: '/',
    exact: true,
    component: MainPage,
  }, {
    path: '/test',
    component: () => <div>Test</div>
  }
]
