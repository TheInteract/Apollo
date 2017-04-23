import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import ResultsPage from './ResultsPage.react'

const queryProduct = gql`
  query getSessionTypes($productId: String!) {
    sessionTypes(productId: $productId) {
      _id
      url
    }
  }
`

const enhance = compose(
  withRouter,
  graphql(queryProduct, {
    options: ({ productId }) => ({ variables: { productId } })
  }),
)

class ResultsPageContainer extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
      isExact: PropTypes.bool.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      sessionTypes: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })),
      loading: PropTypes.bool.isRequired
    })
  }

  render () {
    const { match, data } = this.props
    return (
      <ResultsPage match={match} sessionTypes={data.sessionTypes} />
    )
  }
}

export default enhance(ResultsPageContainer)
