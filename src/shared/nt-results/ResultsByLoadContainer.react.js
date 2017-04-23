import gql from 'graphql-tag'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import ResultsByLoad from './ResultsByLoad.react'

const SESSIONS_QUERY = gql`
  query querySessions ($sessionTypeId: String!, $inputVersion: InputVersion) {
    graph (sessionTypeId: $sessionTypeId, inputVersion: $inputVersion) {
      nodes {
        _id,
        type,
        data,
        count
      }
      links {
        source,
        target,
        count
      }
      paths {
        _id,
        nodes {
          _id,
        },
        count
      }
    }
  }
`

const enhance = compose(
  graphql(SESSIONS_QUERY, {
    options: ({ sessionTypeId, inputVersion }) => ({
      variables: { sessionTypeId, inputVersion },
      pollInterval: 2000
    })
  })
)

class ResultsByLoadContainer extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      graph: PropTypes.shape({
        nodes: PropTypes.arrayOf(PropTypes.shape({
          _id: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          data: PropTypes.string.isRequired,
          count: PropTypes.number.isRequired,
        })).isRequired,
        links: PropTypes.arrayOf(PropTypes.shape({
          source: PropTypes.string.isRequired,
          target: PropTypes.string.isRequired,
          count: PropTypes.number.isRequired,
        })).isRequired,
        paths: PropTypes.arrayOf(PropTypes.shape({
          _id: PropTypes.string.isRequired,
          nodes: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
          })),
          count: PropTypes.number.isRequired,
        })).isRequired,
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  render () {
    return this.props.data.loading ? (
      <Loading message='data fetching...' />
    ) : (
      <ResultsByLoad
        nodes={_.cloneDeep(this.props.data.graph.nodes)}
        links={_.cloneDeep(this.props.data.graph.links)}
        paths={_.cloneDeep(this.props.data.graph.paths)}
      />
    )
  }
}

export default enhance(ResultsByLoadContainer)
