import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import MainPage from './MainPage.react'
import NoMatch from './NoMatch.react'

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
  }),
)

class MainPageContainer extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
      isExact: PropTypes.bool.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      loading: PropTypes.bool,
      error: PropTypes.bool
    })
  }

  renderMainPage = () => (
    <MainPage match={this.props.match} product={this.props.data.product} />
  )

  renderNoMatch = () => (
    <NoMatch url={this.props.match.url} />
  )

  renderLoadingScreen = () => (
    <Loading />
  )

  render () {
    if (this.props.data.loading) {
      return this.renderLoadingScreen()
    } else if (this.props.data.product) {
      return this.renderMainPage()
    } else {
      return this.renderNoMatch()
    }
  }
}

export default enhance(MainPageContainer)
