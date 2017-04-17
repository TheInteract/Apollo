import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import ProductListPage from './ProductListPage.react'

const PRODUCTS_QUERY = gql`
  query queryProducts {
    products {
      _id
      name
    }
  }
`
const enhance = compose(
  withRouter,
  graphql(PRODUCTS_QUERY),
)

const ResultsPageContainer = ({ data }) => (
  <ProductListPage data={data} />
)

ResultsPageContainer.propTypes = {
  data: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool
  })
}

export default enhance(ResultsPageContainer)
