import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { compose } from 'recompose'

import LoginPage from '../nt-login/LoginPage.react'
import MainPage from './MainPage.react'
import NoMatch from './NoMatch.react'

const MainPageContainer = ({ match, data }) => data.product ? (
  <MainPage match={match} product={data.product} />
) : (
  <NoMatch />
)

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
    <Route path='/login' component={LoginPage} />
    <Route path='/:productId' render={enhance(MainPageContainer)} />
    <Route component={NoMatch} />
  </Switch>
)

export default App
