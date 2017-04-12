import * as d3 from 'd3'
import gql from 'graphql-tag'
import _ from 'lodash'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

// import styles from './ResultsByLoad.styl'

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
    height: 500,
  }

  constructor (props) {
    super(props)
    this.state = {
      nodes: _.uniqBy(_.flattenDeep(this.props.data.sessions.map(session => {
        return session.actions.map(action => {
          if (action.type === 'load') {
            return { id: action.actionTypeId, type: action.type, data: action.actionTypeId, fx: 100, fy: 300 }
          } else if (action.type === 'out') {
            return { id: action.actionTypeId, type: action.type, data: action.actionTypeId, fx: 1000, fy: 300 }
          } else {
            return { id: action.actionTypeId, type: action.type, data: action.actionTypeId }
          }
        })
      })), 'id'),
      links: _.uniqWith(_.flattenDeep(this.props.data.sessions.map(session => {
        const actions = session.actions
        const temp = []
        if (actions.length > 1) {
          for (let i = 0; i < actions.length - 1; i++) {
            temp.push({ source: actions[i].actionTypeId, target: actions[i + 1].actionTypeId })
          }
        }
        return temp
      })), _.isEqual)
    }
  }

  componentDidMount () {
    this.force = d3.forceSimulation(this.state.nodes)
      .force('charge',
        d3.forceManyBody()
          .strength(-2000)
      )
      .force('link',
        d3.forceLink().id(d => d.id).links(this.state.links)
      )
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
    return (
      <svg width={this.props.width} height={this.props.height}>
        <g>
          {this.state.links.map((link, index) => (
            <g key={`line-${index}`}>
              <line
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke={`#f${index * 9345 % 100000}`}
              />
              <circle r={10} fill={`#f${index * 9345 % 100000}`} cx={link.target.x - 10} cy={link.target.y - 10} />
            </g>
          ))}
          {this.state.nodes.map((node, index) => (
            <g key={index} transform={`translate(${node.x || 0},${node.y || 0})`}>
              <circle r={5} fill='#f56' />
              {/* <text dx='10' dy='10'>{node.type}</text> */}
              <text dx='10' dy='20'>{node.data}</text>
            </g>
          ))}
        </g>
      </svg>
    )
  }
}

export default enhance(ResultsByLoad)
