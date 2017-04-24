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

const ProductListPageContainer = ({ data }) => (
  <ProductListPage data={data} />
)

ProductListPageContainer.propTypes = {
  data: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ),
    loading: PropTypes.bool,
  })
}

export default enhance(ProductListPageContainer)
