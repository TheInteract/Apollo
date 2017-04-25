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

const SCALE = 25

class ResultsByLoadContainer extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      graph: GraphPropType,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  calculateTotalInputCount = nodes => _.find(nodes, { type: 'load' }).count

  getNodeWithInputOutputCount = nodes => nodes.map(node => {
    const { nodes, links } = this.props.data.graph
    const inputCount = node.type === 'load' ? node.count
      : _.reduce(links, (prev, link) => {
        if (link.target === node._id && link.source !== node._id) {
          return prev + link.count
        }
        return prev
      }, 0)
    const outputCount = _.reduce(links, (prev, link) => {
      if (link.source === node._id && link.target !== node._id) {
        return prev + link.count
      }
      return prev
    }, 0)

    const totalInputCount = this.calculateTotalInputCount(nodes)

    return {
      ...node,
      inputCount: inputCount,
      outputCount: outputCount,
      totalInputCount: totalInputCount,
      size: inputCount / totalInputCount * SCALE + 10
    }
  })

  render () {
    const data = this.props.data
    return (
      <div className={styles.nt}>
        {this.props.data.loading ? (
          <Loading key='loading' />
        ) : (
          <ResultsByLoad
            nodes={this.getNodeWithInputOutputCount()}
            links={_.cloneDeep(data.graph.links)}
            paths={_.cloneDeep(data.graph.paths)}
            totalInputCount={this.calculateTotalInputCount(data.graph.nodes)}
          />
        )}
      </div>
    )
  }
}

export default enhance(ResultsByLoadContainer)
