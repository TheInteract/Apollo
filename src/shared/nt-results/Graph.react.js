import classNames from 'classnames'
import * as d3 from 'd3'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Graph.styl'

const ARROW_WIDTH = 8
const ARROW_HEIGHT = 10
const ARROW_DY = ARROW_HEIGHT / 2

class Graph extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
    paths: PropTypes.array.isRequired,
    getCurveData: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      nodes: this.props.nodes,
      links: this.props.links,
      paths: this.props.paths,
      selectedNodeId: undefined,
      position: { x: 0, y: 0, k: 1 }
    }
  }

  componentWillMount () {
    this.force = d3.forceSimulation(this.state.nodes)
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('link', d3.forceLink()
        .id(d => d.id)
        .distance(200)
        .strength(0.5)
        .links(this.state.links)
      )
      .force('center', d3.forceCenter()
        .x(this.props.width / 2)
        .y(this.props.height / 2)
      )
  }

  componentDidMount () {
    this.force.on('tick', () => this.setState({
      links: this.state.links,
      nodes: this.state.nodes
    }))

    d3.select(this.svg).call(d3.zoom()
      .scaleExtent([ 1 / 2, 4 ])
      .on('zoom', this.zoomed))
  }

  zoomed = () => {
    const { x, y, k } = d3.event.transform
    this.setState({ position: { x, y, k } })
  }

  componentWillUnmount () {
    this.force.stop()
  }

  getNodeSize = node => {
    const max = _.maxBy(this.state.nodes, node => node.count).count
    const width = node.count / max * 16 + 10
    const height = node.count / max * 20 + 16

    return { width, height }
  }

  handleMouseEnterNode = id => () => {
    this.setState({ selectedNodeId: id })
  }

  handleMouseLeaveNode = () => {
    this.setState({ selectedNodeId: undefined })
  }

  isSelected = id => this.state.selectedNodeId === id

  renderLinearGradientRef = () => (
    <linearGradient id='gradient'>
      <stop className={styles.nt__gradientStart} offset='10%' />
      <stop className={styles.nt__gradientEnd} offset='90%' />
    </linearGradient>
  )

  renderArrowMarker = () => (
    <marker
      id='arrowHead'
      viewBox={`0 ${-ARROW_DY} ${ARROW_WIDTH} ${ARROW_HEIGHT}`}
      orient='auto'
      markerWidth={ARROW_WIDTH}
      markerHeight={ARROW_HEIGHT}
    >
      <path
        className={styles.nt__arrowHead}
        d={`M 0,${-ARROW_DY} L ${ARROW_WIDTH},0 L 0,${ARROW_DY} Z`}
      />
    </marker>
  )

  renderGradient = (id, { source, target }) => {
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

  renderPaths = () => {
    const line = d3.line()
      .x(d => _.find(this.state.nodes, { id: d }).x)
      .y(d => _.find(this.state.nodes, { id: d }).y)
      .curve(d3.curveCardinal.tension(0))

    return this.state.paths.map((path, index) => (
      <path
        key={`path-${index}`}
        className={styles.nt__path}
        d={line(path)}
        strokeLinecap='round'
        fill='none'
      />
    ))
  }

  renderLinks = () => this.state.links.map((link, index) => {
    const selected = this.isSelected(link.source.id) ||
      this.isSelected(link.target.id)

    const className = classNames(styles.nt__line, {
      [styles['--selected']]: selected,
      [styles['--not-selected']]: this.state.selectedNodeId && !selected,
    })

    return (
      <g key={`link-${index}`}>
        {this.renderGradient(`gradient-${index}`, link)}
        <path
          className={className}
          d={this.props.getCurveData(link, this.getNodeSize, ARROW_WIDTH)}
          markerEnd='url(#arrowHead)'
          stroke={`url(#gradient-${index})`}
        />
      </g>
    )
  })

  renderNodes = () => this.state.nodes.map((node, index) => {
    const className = classNames(styles.nt__node, {
      [styles['--not-selected']]: this.state.selectedNodeId &&
        !this.isSelected(node.id)
    })
    const translate = `translate(${node.x || 0},${node.y || 0})`
    const { width, height } = this.getNodeSize(node)

    return (
      <g key={index} className={className} transform={translate}>
        <rect
          x={-(width / 2)}
          y={-(height / 2)}
          width={width}
          height={height}
          onMouseEnter={this.handleMouseEnterNode(node.id)}
          onMouseLeave={this.handleMouseLeaveNode}
        />
        <text y={height / 2} dy={15} textAnchor='middle'>{node.type}</text>
      </g>
    )
  })

  render () {
    const { x, y, k } = this.state.position

    return (
      <svg width='100%' height='100%' ref={c => { this.svg = c }}>
        {this.renderLinearGradientRef()}
        {this.renderArrowMarker()}
        <rect width='100%' height='100%' fill='none' />
        <g transform={`translate(${x},${y}) scale(${k})`}>
          {!this.state.selectedNodeId && this.renderPaths()}
          {this.renderLinks()}
          {this.renderNodes()}
        </g>
      </svg>
    )
  }
}

export default Graph
