import * as d3 from 'd3'
import gql from 'graphql-tag'
import _ from 'lodash'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import styles from './ResultsByLoad.styl'

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
    options: ({ sessionTypeId }) => ({ variables: { sessionTypeId: sessionTypeId } })
  })
)

class ResultsByLoad extends React.Component {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    data: React.PropTypes.object,
  }

  static defaultProps = {
    width: 1100,
    height: 600,
  }

  constructor (props) {
    super(props)
    this.state = {
      nodes: _.uniqBy(_.flattenDeep(this.props.data.sessions.map(session => {
        return session.actions.map(action => {
          const node = {
            id: action.actionTypeId,
            type: action.type,
            x: this.props.width / 2,
            y: this.props.height / 2
          }
          if (action.type === 'load') {
            return { ...node, fx: 100, fy: 300 }
          } else {
            return node
          }
        })
      })), 'id'),
      links: _.uniqWith(_.flattenDeep(this.props.data.sessions.map(session => {
        const actions = session.actions
        const temp = []
        if (actions.length > 1) {
          for (let i = 0; i < actions.length - 1; i++) {
            if (actions[i].type !== 'focus' && actions[i + 1].type !== 'blur') {
              if (actions[i].actionTypeId !== actions[i + 1].actionTypeId) {
                temp.push({ source: actions[i].actionTypeId, target: actions[i + 1].actionTypeId })
              }
              // TODO: In the near future, please do the line for target is source
            }
          }
        }
        return temp
      })), _.isEqual),
      paths: this.props.data.sessions.map(session => {
        return _.compact(session.actions.map(action => {
          if (action.type !== 'focus' && action.type !== 'blur') {
            return {
              id: action.actionTypeId,
              type: action.type,
              x: this.props.width / 2,
              y: this.props.height / 2
            }
          }
        }))
      })
    }
  }

  componentDidMount () {
    this.force = d3.forceSimulation(this.state.nodes)
      .force('charge', d3.forceManyBody().strength(-500))
      .force('link', d3.forceLink().id(d => d.id).distance(150).links(this.state.links))
      .force('x', d3.forceX(this.props.width / 2))
      .force('y', d3.forceY(this.props.height / 2))

    this.force.on('tick', () => this.setState({
      links: this.state.links,
      nodes: this.state.nodes
    }))
  }

  componentWillUnmount () {
    this.force.stop()
  }

  renderPaths = () => {
    const line = d3.line()
      .x(d => _.find(this.state.nodes, { id: d.id }).x)
      .y(d => _.find(this.state.nodes, { id: d.id }).y)
      .curve(d3.curveCardinal.tension(0))

    return this.state.paths.map((path, index) => (
      <path
        key={`path-${index}`}
        className={styles.path}
        d={line(path)}
        strokeLinecap='round'
        fill='none'
      />
    ))
  }

  renderGradient = (id, source, target) => {
    const angle = Math.atan2(source.y - target.y, source.x - target.x)

    function angleToPoints (angle) {
      var segment = Math.floor(angle / Math.PI * 2) + 2
      var diagonal = (1 / 2 * segment + 1 / 4) * Math.PI
      var op = Math.cos(Math.abs(diagonal - angle)) * Math.sqrt(2)
      var x = op * Math.cos(angle)
      var y = op * Math.sin(angle)

      return {
        x1: x < 0 ? 1 : 0,
        y1: y < 0 ? 1 : 0,
        x2: x >= 0 ? x : x + 1,
        y2: y >= 0 ? y : y + 1
      }
    }

    return (
      <linearGradient id={id} xlinkHref='#gradient' {...angleToPoints(angle)} />
    )
  }

  renderLinks = () => this.state.links.map((link, index) => {
    return (
      <g key={`link-${index}`}>
        {this.renderGradient(`gradient-${index}`, link.source, link.target)}
        <path
          className={styles.line}
          d={`M ${link.source.x}, ${link.source.y}
            C ${link.source.x + 100},${link.source.y}
              ${link.target.x - 100}, ${link.target.y}
              ${link.target.x}, ${link.target.y}`}
          markerEnd='url(#arrowHead)'
          stroke={`url(#gradient-${index})`}
        />
      </g>
    )
  })

  renderNodes = () => this.state.nodes.map((node, index) => (
    <g key={index} transform={`translate(${node.x || 0},${node.y || 0})`}>
      <rect className={styles.node} x={-5} y={-8} width={10} height={16} />
      <text x={-5} dy={25}>{node.type}</text>
    </g>
  ))

  render () {
    return (
      <svg width={this.props.width} height={this.props.height}>
        <linearGradient id='gradient'>
          <stop className={styles.from} offset='10%' />
          <stop className={styles.to} offset='90%' />
        </linearGradient>
        <marker
          id='arrowHead'
          viewBox='0 -5 10 10'
          refX='12'
          orient='auto'
          markerWidth='10'
          markerHeight='10'
        >
          <path d='M 0,-5 L 8,0 L 0,5' className={styles.arrow} />
        </marker>
        {this.renderPaths()}
        {this.renderLinks()}
        {this.renderNodes()}
      </svg>
    )
  }
}

export default enhance(ResultsByLoad)
