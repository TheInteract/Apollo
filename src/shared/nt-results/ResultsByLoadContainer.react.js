import gql from 'graphql-tag'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import ResultsByLoad from './ResultsByLoad.react'
import styles from './ResultsByLoadContainer.styl'
import GraphPropType from './GraphPropType'

const SESSIONS_QUERY = gql`
  query querySessions ($sessionTypeId: String!, $featureId: String, $versionName: String) {
    graph (sessionTypeId: $sessionTypeId, featureId: $featureId, versionName: $versionName) {
      nodes {
        _id,
        type,
        data,
        count,
        v
      }
      links {
        _id,
        source,
        target,
        count,
        v
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
    options: ({ sessionTypeId, featureId, versionName }) => ({
      variables: { sessionTypeId, featureId, versionName },
      pollInterval: 2000
    })
  })
)

class ResultsByLoadContainer extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      graph: GraphPropType,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  render () {
    return (
      <div className={styles.nt} ref={c => { this.container = c }}>
        {this.props.data.loading ? (
          <Loading key='loading' />
        ) : (
          <ResultsByLoad
            nodes={_.cloneDeep(this.props.data.graph.nodes)}
            links={_.cloneDeep(this.props.data.graph.links)}
            paths={_.cloneDeep(this.props.data.graph.paths)}
          />
        )}
      </div>
    )
  }
}

export default enhance(ResultsByLoadContainer)
