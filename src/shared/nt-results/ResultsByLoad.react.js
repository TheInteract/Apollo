import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import Graph from './Graph.react'
import styles from './ResultsByLoad.styl'
import {
  MIN_HEIGHT,
  MIN_WIDTH,
  generateLinks,
  generateNodes,
  generatePaths,
  generateSortedNodes,
} from './ResultsByLoad'

const SESSIONS_QUERY = gql`
  query querySessions ($sessionTypeId: String!) {
    sessions (sessionTypeId: $sessionTypeId) {
      actions {
        actionTypeId,
        type,
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

  getData = () => ({
    nodes: generateNodes(this.props.data.sessions),
    links: generateLinks(this.props.data.sessions),
    paths: generatePaths(this.props.data.sessions),
    getCurveData: ({ source, target }, getNodeSize, arrowWidth) => {
      const dx = 150
      return `M ${source.x + getNodeSize(source).width / 2}, ${source.y}
        C ${source.x + dx},${source.y}
          ${target.x - dx + arrowWidth}, ${target.y}
          ${target.x - getNodeSize(target).width / 2 - arrowWidth}, ${target.y}`
    }
  })

  getWaterfallData = () => {
    const data = this.getData()
    return {
      ...data,
      nodes: generateSortedNodes(data.nodes, data.links),
      getCurveData: ({ source, target }, getNodeSize, arrowWidth) => {
        const dx = target.x - source.x
        const dy = target.y - source.y
        const tdx = getNodeSize(target).width / 2 + arrowWidth
        return `M ${source.x}, ${source.y + getNodeSize(source).height / 2}
          C ${source.x},${source.y + (dy || -100)}
            ${target.x - (dx || 100)}, ${target.y}
            ${target.x + (dx >= 0 ? -tdx : tdx)}, ${target.y}`
      }
    }
  }

  render () {
    return (
      <div className={styles.nt}>
        <Graph width={MIN_WIDTH} height={MIN_HEIGHT} {...this.getWaterfallData()} />
      </div>
    )
  }
}

export default enhance(ResultsByLoad)
