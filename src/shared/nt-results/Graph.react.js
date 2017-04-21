import * as d3 from 'd3'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ArrowHeadMarker from './ArrowHeadMarker.react'
import styles from './Graph.styl'
import Link, { FADE as LINK_FADE, NORMAL as LINK_NORMAL } from './Link.react'
import Node, { FADE as NODE_FADE, NORMAL as NODE_NORMAL } from './Node.react'

class Graph extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      fx: PropTypes.number,
      fy: PropTypes.number,
    })).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.string.isRequired,
      target: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })).isRequired,
    paths: PropTypes.array.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      nodes: _.cloneDeep(this.props.nodes),
      links: _.cloneDeep(this.props.links),
      paths: this.props.paths,
      selectedNodeId: undefined,
      position: { x: 100, y: 0, k: 1 }
    }
  }

  componentWillMount () {
    this.force = d3.forceSimulation(this.state.nodes)
      .force('charge', d3.forceManyBody()
        .strength(-2000)
        .theta(0)
      )
      .force('link', d3.forceLink()
        .id(d => d._id)
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
      .scaleExtent([ 1 / 3, 2 ])
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
    const max = _.maxBy(this.state.nodes, node => node.count).count + 1
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

  isSelected = id => (this.state.selectedNodeId &&
    this.state.selectedNodeId === id) || !this.state.selectedNodeId

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
    const selected = this.isSelected(link.source._id) ||
      this.isSelected(link.target._id)
    return (
      <Link
        key={`link-${index}`}
        id={index}
        {...link}
        getNodeSize={this.getNodeSize}
        apparent={selected ? LINK_NORMAL : LINK_FADE}
      />
    )
  })

  renderNodes = () => this.state.nodes.map((node, index) => (
    <Node
      key={`node-${index}`}
      {...node}
      {...this.getNodeSize(node)}
      onMouseEnter={this.handleMouseEnterNode(node._id)}
      onMouseLeave={this.handleMouseLeaveNode}
      apparent={!this.isSelected(node._id) ? NODE_FADE : NODE_NORMAL}
    />
  ))

  render () {
    const { x, y, k } = this.state.position

    return (
      <svg width='100%' height='100%' ref={c => { this.svg = c }}>
        <linearGradient id='gradient'>
          <stop className={styles.nt__gradientStart} offset='10%' />
          <stop className={styles.nt__gradientEnd} offset='90%' />
        </linearGradient>
        <ArrowHeadMarker />
        <rect width='100%' height='100%' fill='none' />
        <g transform={`translate(${x},${y}) scale(${k})`}>
          {/* !this.state.selectedNodeId && this.renderPaths() */}
          {this.renderLinks()}
          {this.renderNodes()}
        </g>
      </svg>
    )
  }
}

export default Graph
