import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import Graph from './Graph.react'
import styles from './ResultsByLoad.styl'

export const MIN_WIDTH = 900
export const MIN_HEIGHT = 600

const SESSIONS_QUERY = gql`
  query querySessions ($sessionTypeId: String!) {
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
    paths (sessionTypeId: $sessionTypeId) {
      _id,
      nodes {
        _id,
      },
      count
    }
  }
`

const enhance = compose(
  graphql(SESSIONS_QUERY, {
    options: ({ sessionTypeId, version }) => ({
      variables: { sessionTypeId, version },
      pollInterval: 2000
    })
  })
)

class ResultsByLoad extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
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
      paths: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nodes: PropTypes.arrayOf(PropTypes.shape({
          _id: PropTypes.string.isRequired,
        })),
        count: PropTypes.number.isRequired,
      })),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      selectedNodeId: undefined,
      selectedPath: undefined,
    }
  }

  handleSelectPath = path => () => {
    this.setState({
      selectedPath: path,
      selectedNodeId: undefined
    })
  }

  handleDeselectPath = () => {
    this.setState({ selectedPath: undefined })
  }

  renderPathSelector = () => this.props.data.paths ? (
    <div className={styles.nt__pathSelector}>
      {this.props.data.paths.map((path, index) => (
        <div
          key={index}
          className={styles.nt__path}
          onMouseEnter={this.handleSelectPath(path)}
          onMouseLeave={this.handleDeselectPath}
          style={{ height: path.count * 0.2 + 12 }}
        >
          {path._id}
        </div>
      ))}
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
      paths={this.props.data.paths}
      selectedPath={this.state.selectedPath}
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
