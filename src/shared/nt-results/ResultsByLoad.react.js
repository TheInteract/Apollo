import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import Graph from './Graph.react'
import styles from './ResultsByLoad.styl'
import {
  generatePaths,
} from './ResultsByLoad'

export const MIN_WIDTH = 900
export const MIN_HEIGHT = 600

const SESSIONS_QUERY = gql`
  query querySessions ($sessionTypeId: String!) {
    sessions (sessionTypeId: $sessionTypeId) {
      _id
      actions {
        _id,
        type,
        data
      }
    }
    nodes (sessionTypeId: $sessionTypeId) {
      _id,
      type,
      data,
      count
    }
    links (sessionTypeId: $sessionTypeId) {
      source,
      target,
      count
    }
  }
`

const enhance = compose(
  graphql(SESSIONS_QUERY, {
    options: ({ sessionTypeId }) => ({
      variables: { sessionTypeId: sessionTypeId }
    })
  })
)

class ResultsByLoad extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      sessions: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
      })).isRequired,
      nodes: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        data: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
      })),
      links: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
      })),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  renderPathSelector = () => this.props.data.sessions ? (
    <div className={styles.nt__pathSelector}>
      {this.props.data.sessions.map((sessions, index) => {
        return (
          <div
            key={index}
            className={styles.nt__path}
          >
            {sessions._id}
          </div>
        )
      })}
    </div>
  ) : null

  renderLoadingState = () => (
    <div className={styles.nt__loadingState}>
      <Loading message='data fetching...' />
    </div>
  )

  renderGraph = () => (
    <Graph
      width={MIN_WIDTH}
      height={MIN_HEIGHT}
      nodes={this.props.data.nodes}
      links={this.props.data.links}
      paths={generatePaths(this.props.data.sessions)}
    />
  )

  render () {
    const loading = this.props.data.loading

    return (
      <div className={styles.nt}>
        {this.renderPathSelector()}
        {loading ? this.renderLoadingState() : this.renderGraph()}
      </div>
    )
  }
}

export default enhance(ResultsByLoad)
