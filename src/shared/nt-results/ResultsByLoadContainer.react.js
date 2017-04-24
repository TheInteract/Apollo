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
      graphA: GraphPropType.isRequired,
      graphB: GraphPropType.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  constructor (props) {
    super(props)
    this.state = { x: 0 }
  }

  componentDidMount () {
    d3.select(this.divider).call(d3.drag()
      .on('drag', this.dragged)
    )

    this.setState({ x: this.container.clientWidth / 2 })
  }

  dragged = () => {
    this.setState({ x: d3.event.x < 0 ? 0 : d3.event.x })
  }

  render () {
    return this.props.data.loading ? (
      <Loading message='data fetching...' />
    ) : (
      <div ref={c => { this.container = c }}>
        <div className={styles.nt__A} style={{ width: `${this.state.x}px` }}>
          <ResultsByLoad
            nodes={_.cloneDeep(this.props.data.graphA.nodes)}
            links={_.cloneDeep(this.props.data.graphA.links)}
            paths={_.cloneDeep(this.props.data.graphA.paths)}
          />
        </div>
        <div
          className={styles.nt__divider}
          style={{ transform: `translateX(${this.state.x}px)` }}
          ref={c => { this.divider = c }}
        />
        <div className={styles.nt__B} style={{ left: `${this.state.x}px` }}>
          <ResultsByLoad
            nodes={_.cloneDeep(this.props.data.graphB.nodes)}
            links={_.cloneDeep(this.props.data.graphB.links)}
            paths={_.cloneDeep(this.props.data.graphB.paths)}
          />
        </div>
      </div>
    )
  }
}

export default enhance(ResultsByLoadContainer)
