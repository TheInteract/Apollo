import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import Graph from './Graph.react'
import styles from './ResultsByLoad.styl'
import {
  MIN_HEIGHT,
  MIN_WIDTH,
  generateLinks,
  generateNodes,
  generatePaths,
} from './ResultsByLoad'

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
    data: PropTypes.object,
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
      nodes={generateNodes(this.props.data.sessions)}
      links={generateLinks(this.props.data.sessions)}
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
