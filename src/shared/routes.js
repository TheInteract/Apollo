import React from 'react'

import Home from './core-app/Home.react'
import NoMatch from './core-app/NoMatch.react'

export default [
  {
    path: '/',
    exact: true,
    component: Home,
  }, {
    path: '/test',
    component: () => <div>Test</div>
  }, {
    component: NoMatch,
  }
]
