import PropTypes from 'prop-types'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import ProductListPage from '../nt-products/ProductListPage.react'
import MainPage from './MainPage.react'
import NoMatch from './NoMatch.react'

const MainRouter = ({ component: Component, computedMatch, ...rest }) => (
  <Route {...Object.assign(computedMatch, rest)} render={props =>
    (computedMatch.params.productId) ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: '/products' }} />
    )
  } />
)

MainRouter.propTypes = {
  component: PropTypes.func.isRequired,
  computedMatch: PropTypes.object
}

const App = () => (
  <Switch>
    <Redirect exact path='/' to={{ pathname: '/products' }} />
    <Route exact path='/products' component={ProductListPage} />
    <MainRouter path='/products/:productId' component={MainPage} />
    <Route component={NoMatch} />
  </Switch>
)

export default App
