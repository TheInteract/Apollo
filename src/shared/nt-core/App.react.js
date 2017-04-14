import PropTypes from 'prop-types'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import ProductListPage from '../nt-products/ProductListPage.react'
import MainPage from './MainPage.react'
import NoMatch from './NoMatch.react'

const ValidateRouter = ({ component: Component, computedMatch, ...rest }) => (
  <Route {...Object.assign(computedMatch, rest)} render={props =>
    (computedMatch.params.productId && computedMatch.params.productId.match(/^[0-9a-fA-F]{24}$/)) ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: '/products' }} />
    )
  } />
)

ValidateRouter.propTypes = {
  component: PropTypes.func.isRequired,
  computedMatch: PropTypes.object.isRequired
}

const App = () => (
  <Switch>
    <Route path='/products' component={ProductListPage} />
    <ValidateRouter path='/:productId' component={MainPage} />
    <Route component={NoMatch} />
  </Switch>
)

export default App
