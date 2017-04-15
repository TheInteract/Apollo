import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import ProductListPageContainer from '../nt-products/ProductListPage.container.react'
import MainPageContainer from './MainPage.container.react'
import NoMatch from './NoMatch.react'

const App = () => (
  <Switch>
    <Redirect exact path='/' to={{ pathname: '/products' }} />
    <Route exact path='/products' component={ProductListPageContainer} />
    <Route path='/products/:productId' component={MainPageContainer} />
    <Route path='/404' component={NoMatch} />
    <Redirect path='*' to={{ pathname: '/404' }} />
  </Switch>
)

export default App
