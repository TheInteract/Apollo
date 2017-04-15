import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import ProductListPage from '../nt-products/ProductListPage.react'
import MainPageContainer from './MainPage.container.react'
import NoMatch from './NoMatch.react'

const App = () => (
  <Switch>
    <Redirect exact path='/' to={{ pathname: '/products' }} />
    <Route exact path='/products' component={ProductListPage} />
    <Route path='/products/:productId' component={MainPageContainer} />
    <Route component={NoMatch} />
  </Switch>
)

export default App
