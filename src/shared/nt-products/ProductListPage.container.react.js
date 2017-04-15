import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import { withLoader } from '../nt-utils/withLoader.react'
import ProductListPage from './ProductListPage.react'

const PRODUCTS_QUERY = gql`
  query queryProducts {
    products {
      _id
      name
    }
  }
`

const ResultsPageContainer = ({ data }) => <ProductListPage products={data.products} />

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

const enhance = compose(
  withRouter,
  graphql(PRODUCTS_QUERY),
  withLoader
)

export default enhance(ResultsPageContainer)
