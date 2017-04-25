import * as d3 from 'd3'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ArrowHeadMarker from './ArrowHeadMarker.react'
import styles from './Graph.styl'
import Link from './Link.react'
import Node from './Node.react'
import Path from './Path.react'

class Graph extends React.Component {
  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
      inputCount: PropTypes.number.isRequired,
      outputCount: PropTypes.number.isRequired,
    })).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]).isRequired,
      target: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]).isRequired,
      count: PropTypes.number.isRequired,
    })).isRequired,
    paths: PropTypes.PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nodes: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
      })).isRequired,
      count: PropTypes.number.isRequired,
    })).isRequired,
    totalInputCount: PropTypes.number.isRequired,
    selectedPath: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nodes: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
      })).isRequired,
    }),
    selectedNodeId: PropTypes.string,
    onNodeHover: PropTypes.func.isRequired,
    linkType: PropTypes.oneOf([ 'path', 'link' ])
  }

  constructor (props) {
    super(props)
    this.state = {
      nodes: this.props.nodes,
      links: this.props.links,
      paths: this.props.paths,
      position: { x: 100, y: 0, k: 1 }
    }
  }

  componentWillReceiveProps (nextProps) {
    const sameNode = _.isEqual(this.props.nodes, nextProps.nodes)
    const sameLink = _.isEqual(this.props.links, nextProps.links)
    const samePath = _.isEqual(this.props.paths, nextProps.paths)

    if (sameNode && sameLink && samePath) return

    const updatedNodes = _.map(nextProps.nodes, updatedNode => {
      const node = _.find(this.state.nodes, [ '_id', updatedNode._id ])
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
      ))
      return {
        ...link,
        ...updatedLink,
      }
    })

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
      .force('center', d3.forceCenter()
        .x(this.graph.offsetWidth / 3)
        .y(this.graph.offsetHeight / 2)
      )

    this.force.alpha(1).restart()
  }

  componentDidMount () {
    this.force = d3.forceSimulation(this.state.nodes)
      .force('charge', d3.forceManyBody()
        .strength(-2000)
      )
      .force('link', d3.forceLink()
        .id(d => d._id)
        .links(this.state.links)
      )
      .force('center', d3.forceCenter()
        .x(this.graph.offsetWidth / 2)
        .y(this.graph.offsetHeight / 2)
      )

    this.force.on('tick', () => this.setState({
      links: this.state.links,
      nodes: this.state.nodes
    }))

    d3.select(this.graph).call(d3.zoom()
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

  isNotSelectedNode = nodeId => this.props.selectedNodeId &&
    this.props.selectedNodeId !== nodeId

  isNotInSelectedPath = nodeId => this.props.selectedPath &&
    !_.find(this.props.selectedPath.nodes, { _id: nodeId })

  isLinkNotInSelectedPath = (sourceId, targetId) => {
    if (!this.props.selectedPath) return false

    const nodes = this.props.selectedPath.nodes

    if (nodes.length > 1) {
      for (let i = 0; i < nodes.length - 1; i++) {
        if (nodes[i]._id === sourceId && nodes[i + 1]._id === targetId) {
          return false
        }
      }
    }

    return true
  }

  shouldNodeFade = nodeId => this.isNotSelectedNode(nodeId) ||
    this.isNotInSelectedPath(nodeId)

  shouldLinkFade = (sourceId, targetId) =>
    (this.isNotSelectedNode(sourceId) && this.isNotSelectedNode(targetId)) ||
      this.isLinkNotInSelectedPath(sourceId, targetId)

  renderPaths = () => this.props.paths.map((path, index) => (
    <Path
      key={`path-${index}`}
      path={path}
      findNode={nodeId => _.find(this.state.nodes, { _id: nodeId })}
      fade={this.props.selectedPath && this.props.selectedPath._id !== path._id}
    />
  ))

  renderLinks = () => this.state.links.map((link, index) => (
    <Link
      key={`link-${index}`}
      id={index}
      {...link}
      totalInputCount={this.props.totalInputCount}
      fade={this.shouldLinkFade(link.source._id, link.target._id)}
    />
  ))

  renderNodes = () => this.state.nodes.map((node, index) => (
    <Node
      key={`node-${index}`}
      {...node}
      onMouseEnter={this.props.onNodeHover(node._id)}
      onMouseLeave={this.props.onNodeHover()}
      fade={this.shouldNodeFade(node._id)}
    />
  ))

  render () {
    const { x, y, k } = this.state.position

    return (
      <div className={styles.nt} ref={c => { this.graph = c }}>
        <svg width='100%' height='100%'>
          <linearGradient id='gradient'>
            <stop className={styles.nt__gradientStart} offset='10%' />
            <stop className={styles.nt__gradientEnd} offset='90%' />
          </linearGradient>
          <ArrowHeadMarker />
          <g transform={`translate(${x},${y}) scale(${k})`}>
            {this.force && this.props.linkType === 'path' && this.renderPaths()}
            {this.force && this.props.linkType === 'link' && this.renderLinks()}
            {this.force && this.renderNodes()}
          </g>
        </svg>
      </div>
    )
  }
}

export default Graph
