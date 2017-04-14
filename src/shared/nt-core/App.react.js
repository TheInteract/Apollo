import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { Redirect, Route, Switch } from 'react-router-dom'
import { compose } from 'recompose'

import ProductListPage from '../nt-products/ProductListPage.react'
import MainPage from './MainPage.react'
import NoMatch from './NoMatch.react'

// import LoginPage from '../nt-login/LoginPage.react'
const MainPageContainer = ({ match, data }) => data.product ? (
  <MainPage match={match} product={data.product} />
) : (
  <NoMatch />
)

// const MainPageContainer = ({ match, data }) => <MainPage match={match} product={data.product} />


MainPageContainer.propTypes = {
  match: React.PropTypes.object.isRequired,
  data: React.PropTypes.shape({
    product: React.PropTypes.object,
  }).isRequired,
}

const queryProduct = gql`
  query getProduct($productId: String!) {
    product(_id: $productId) {
      _id
      name
    }
  }
`

const enhance = compose(
  withRouter,
  graphql(queryProduct, {
    options: ({ match }) => ({ variables: { productId: match.params.productId } })
  })
)

const App = () => (
  <Switch>
    <Redirect from='/' to='/products' exact />
    <Route path='/products' component={ProductListPage} />
    <Route path='/:productId' render={enhance(MainPageContainer)} />
    <Route component={NoMatch} />
  </Switch>
)

export default App
