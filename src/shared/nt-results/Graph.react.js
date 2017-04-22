import * as d3 from 'd3'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ArrowHeadMarker from './ArrowHeadMarker.react'
import styles from './Graph.styl'
import Link from './Link.react'
import Node from './Node.react'

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
    paths: PropTypes.PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nodes: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
      })).isRequired,
    })).isRequired,
    selectedPath: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nodes: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
      })).isRequired,
    }),
  }

  constructor (props) {
    super(props)
    this.state = {
      nodes: _.cloneDeep(this.props.nodes),
      links: _.cloneDeep(this.props.links),
      paths: _.cloneDeep(this.props.paths),
      selectedNodeId: undefined,
      position: { x: 100, y: 0, k: 1 }
    }
  }

  componentWillReceiveProps (nextProps) {
    const sameNode = _.isEqual(this.props.nodes, nextProps.nodes)
    const sameLink = _.isEqual(this.props.links, nextProps.links)
    const samePath = _.isEqual(this.props.paths, nextProps.paths)

    if (sameNode && sameLink && samePath) return

    const updatedNodes = _.map(nextProps.nodes, updatedNode => {
      const node = _.find(this.state.nodes, [ '_id', updatedNode._id ]) || {}
      return {
        x: 0,
        y: 0,
        ...node,
        ...updatedNode,
      }
    })

    const updatedLinks = _.map(nextProps.links, updatedLink => {
      const link = _.find(this.state.links, link => (
        link.source._id === updatedLink.source &&
          link.target._id === updatedLink.target
      )) || {}
      return {
        ...link,
        ...updatedLink,
      }
    })

    console.log('n', updatedNodes)
    console.log('l', updatedLinks)

    this.setState({
      nodes: updatedNodes,
      links: updatedLinks,
    })

    this.force
      .nodes(updatedNodes)
      .force('link', d3.forceLink()
        .id(d => d._id)
        .links(updatedLinks)
      )

    this.force.alpha(1).restart()
  }

  componentWillMount () {
    this.force = d3.forceSimulation(this.state.nodes)
      .force('charge', d3.forceManyBody()
        .strength(-2000)
        .distanceMin(300)
        .distanceMax(800)
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
      .scaleExtent([ 1 / 2, 3 ])
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

  isNotSelectedNode = nodeId => this.state.selectedNodeId &&
    this.state.selectedNodeId !== nodeId

  isNotInSelectedPath = nodeId => this.props.selectedPath &&
    !_.find(this.props.selectedPath.nodes, { _id: nodeId })

  shouldNodeFade = nodeId => this.isNotSelectedNode(nodeId) ||
    this.isNotInSelectedPath(nodeId)

  shouldLinkFade = (sourceId, targetId) =>
    (this.isNotSelectedNode(sourceId) && this.isNotSelectedNode(targetId)) ||
      (this.isNotInSelectedPath(sourceId) || this.isNotInSelectedPath(targetId))

  renderPaths = () => {
    const line = d3.line()
      .x(d => _.find(this.state.nodes, { _id: d._id }).x)
      .y(d => _.find(this.state.nodes, { _id: d._id }).y)
      .curve(d3.curveCardinal.tension(0))

    return this.state.paths.map((path, index) => (
      <path
        key={`path-${index}`}
        className={styles.nt__path}
        d={line(path.nodes)}
        strokeLinecap='round'
        fill='none'
      />
    ))
  }

  renderLinks = () => this.state.links.map((link, index) => (
    <Link
      key={`link-${index}`}
      id={index}
      {...link}
      getNodeSize={this.getNodeSize}
      fade={this.shouldLinkFade(link.source._id, link.target._id)}
    />
  ))

  renderNodes = () => this.state.nodes.map((node, index) => (
    <Node
      key={`node-${index}`}
      {...node}
      {...this.getNodeSize(node)}
      onMouseEnter={this.handleMouseEnterNode(node._id)}
      onMouseLeave={this.handleMouseLeaveNode}
      fade={this.shouldNodeFade(node._id)}
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
          {/* this.renderPaths() */}
          {this.renderLinks()}
          {this.renderNodes()}
        </g>
      </svg>
    )
  }
}

export default Graph
