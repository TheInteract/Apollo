import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import { handleError, withLoader } from '../nt-utils/withLoader.react'
import MainPage from './MainPage.react'

const queryProduct = gql`
  query getProduct($productId: String!) {
    product(_id: $productId) {
      _id
      name
    }
  }
`

const MainPageContainer = ({ match, data }) => <MainPage match={match} product={data.product} />

MainPageContainer.propTypes = {
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

const enhance = compose(
  withRouter,
  graphql(queryProduct, {
    options: ({ match }) => ({ variables: { productId: match.params.productId } })
  }),
  handleError(({ data }) => (!data.product && !data.loading)),
  withLoader
)

export default enhance(MainPageContainer)
