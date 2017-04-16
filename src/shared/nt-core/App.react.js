import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import ProductListPageContainer from '../nt-products/ProductListPageContainer.react'
import MainPageContainer from './MainPageContainer.react'

const App = () => (
  <Switch>
    <Redirect exact path='/' to={{ pathname: '/products' }} />
    <Route path='/products' component={ProductListPageContainer} />
    <Route path='/:productId' component={MainPageContainer} />
  </Switch>
)

export default App
