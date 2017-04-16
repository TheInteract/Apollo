import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import ProductListPageContainer from '../nt-products/ProductListPageContainer.react'
import MainPageContainer from './MainPageContainer.react'

const App = () => (
  <Switch>
    <Redirect exact from='/' to='/products' />
    <Route path='/products' component={ProductListPageContainer} />
    <Route path='/:productId' component={MainPageContainer} />
  </Switch>
)

export default App
