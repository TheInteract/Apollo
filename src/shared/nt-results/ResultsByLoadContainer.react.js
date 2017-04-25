import * as d3 from 'd3'
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
  query querySessions ($sessionTypeId: String!, $featureId: String) {
    overallGraph: graph (sessionTypeId: $sessionTypeId) {
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
    graphA: graph (sessionTypeId: $sessionTypeId, featureId: $featureId, name: "A") {
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
    graphB: graph (sessionTypeId: $sessionTypeId, featureId: $featureId, name: "B") {
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
    options: ({ sessionTypeId, featureId }) => ({
      variables: { sessionTypeId, featureId },
      pollInterval: 2000
    })
  })
)

class ResultsByLoadContainer extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      overallGraph: GraphPropType,
      graphA: GraphPropType,
      graphB: GraphPropType,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    featureId: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = { x: 0 }
  }

  componentDidMount () {
    d3.select(this.divider).call(d3.drag()
      .on('drag', this.dragged)
    )

    if (this.container) {
      this.setState({ x: this.container.clientWidth / 2 })
    }
  }

  dragged = () => {
    const x = d3.event.x
    this.setState({
      x: x < 0 ? 0 : x > this.container.clientWidth
        ? this.container.clientWidth : x
    })
  }

  renderResults = (graph, styleName, style) => (
    <div className={styles[styleName]} style={style}>
      {this.props.data.loading ? (
        <Loading key='loading' />
      ) : (
        <ResultsByLoad
          key={graph}
          nodes={_.cloneDeep(this.props.data[graph].nodes)}
          links={_.cloneDeep(this.props.data[graph].links)}
          paths={_.cloneDeep(this.props.data[graph].paths)}
        />
      )}
    </div>
  )

  renderABGraphs = () => ([
    this.renderResults('graphA', 'nt__A', { width: `${this.state.x}px` }),
    <div
      key='divider'
      className={styles.nt__divider}
      style={{ transform: `translateX(${this.state.x}px)` }}
      ref={c => { this.divider = c }}
    />,
    this.renderResults('graphB', 'nt__B', { left: `${this.state.x}px` }),
  ])

  renderOverallGraph = () => this.renderResults('overallGraph', 'nt__overall')

  render () {
    return (
      <div ref={c => { this.container = c }}>
        {this.props.featureId ? this.renderABGraphs() : this.renderOverallGraph()}
      </div>
    )
  }
}

export default enhance(ResultsByLoadContainer)
