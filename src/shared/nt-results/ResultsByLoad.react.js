import gql from 'graphql-tag'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import Graph from './Graph.react'
import styles from './ResultsByLoad.styl'

const MIN_WIDTH = 900
const MIN_HEIGHT = 600

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

export const mapActionsToNodes = session => session.actions.map(action => {
  const node = { id: action.actionTypeId, type: action.type }
  return action.type === 'load' ? { ...node, fx: 100, fy: MIN_HEIGHT / 2 } : node
})

export const mapActionsToLinks = session => {
  const actions = session.actions
  const links = []

  if (actions.length > 1) {
    for (let i = 0; i < actions.length - 1; i++) {
      links.push({
        source: actions[i].actionTypeId,
        target: actions[i + 1].actionTypeId
      })
    }
  }
  return links
}

const GAP = 80

export const generateSortedNodes = (nodes, links) => _.flow([
  links => _.groupBy(links, link => link.source.id),
  sources => _.map(nodes, node => ({
    ...node,
    count: (sources[node.id] || []).length
  })),
  nodes => _.sortBy(nodes, node => node.count),
  nodes => _.map(nodes, (node, index) => ({
    ...node,
    fx: index * GAP + GAP,
    fy: index * GAP + GAP,
  }))
])(links)

export const generateNodes = (sessions = []) => _.flow([
  sessions => _.map(sessions, mapActionsToNodes),
  nodes => _.flattenDeep(nodes),
  nodes => _.groupBy(nodes, node => node.id),
  nodes => _.map(Object.keys(nodes), nodeId => ({
    id: nodeId,
    count: nodes[nodeId].length,
    ...nodes[nodeId][0]
  }))
])(sessions)

export const generateLinks = (sessions = []) => _.flow([
  sessions => _.map(sessions, mapActionsToLinks),
  links => _.flattenDeep(links),
  links => _.uniqWith(links, _.isEqual)
])(sessions)

export const generatePaths = (sessions = []) => sessions.map(session => {
  return _.compact(session.actions.map(action => action.actionTypeId))
})

class ResultsByLoad extends React.Component {
  static propTypes = {
    data: PropTypes.object,
  }

  componentDidUpdate () {
    console.log('update')
  }

  getNormalData = () => ({
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
    const data = this.getNormalData()
    return { ...data, nodes: generateSortedNodes(data.nodes, data.links) }
  }

  render () {
    console.log(this.props.data.sessions)
    return (
      <div className={styles.nt}>
        <Graph width={MIN_WIDTH} height={MIN_HEIGHT} {...this.getNormalData()} />
      </div>
    )
  }
}

export default enhance(ResultsByLoad)
