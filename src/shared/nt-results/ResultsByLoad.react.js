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

  render () {
    const line = d3.line()
      .x(d => _.find(this.state.nodes, { id: d.id }).x)
      .y(d => _.find(this.state.nodes, { id: d.id }).y)
      .curve(d3.curveCardinal.tension(0))

    return (
      <svg width={this.props.width} height={this.props.height}>
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
        <g>
          {this.state.paths.map((path, index) => (
            <path
              key={`path-${index}`}
              className={styles.path}
              d={line(path)}
              strokeLinecap='round'
              fill='none'
            />
          ))}
          {this.state.links.map((link, index) => {
            const angle = Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x) * 180 / Math.PI
            return (
              <g key={`link-${index}`}>
                <linearGradient id={`gradient-${index}`} gradientTransform={`rotate(${angle})`}>
                  <stop className={styles.from} offset='10%' />
                  <stop className={styles.to} offset='90%' />
                </linearGradient>
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
          })}
          {this.state.nodes.map((node, index) => (
            <g key={index} transform={`translate(${node.x || 0},${node.y || 0})`}>
              <rect className={styles.node} x={-5} y={-8} width={10} height={16} />
              <text x={-5} dy={25}>{node.type}</text>
            </g>
          ))}
        </g>
      </svg>
    )
  }
}

export default enhance(ResultsByLoad)
