import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'

const PRODUCTS_QUERY = gql`
  query queryProducts {
    products {
      _id
      name
    }
  }
`

class ResultsPage extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      products: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        })
      ).isRequired
    })
  }
  render () {
    return <div>{JSON.stringify(this.props.data.products)}</div>
  }
}

export default graphql(PRODUCTS_QUERY)(ResultsPage)
