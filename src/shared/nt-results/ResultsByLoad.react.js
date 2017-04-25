import PropTypes from 'prop-types'
import React from 'react'

import Graph from './Graph.react'
import styles from './ResultsByLoad.styl'

class ResultsByLoad extends React.Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
    paths: PropTypes.array.isRequired,
    totalInputCount: PropTypes.number.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      selectedNodeId: undefined,
      selectedPath: undefined,
    }
  }

  handlePathSelect = path => () => {
    this.setState({
      selectedPath: path,
      selectedNodeId: undefined
    })
  }

  handlePathDeselect = () => {
    this.setState({ selectedPath: undefined })
  }

  handleNodeSelect = nodeId => () => {
    this.setState({ selectedNodeId: nodeId })
  }

  toggleLinkType = () => {
    this.setState({ path: !this.state.path })
  }

  renderInfoPanel = () => (
    <div className={styles.nt__infoPanel} />
  )

  renderLineType = () => (
    <div className={styles.nt__linkTypeSelector} onClick={this.toggleLinkType}>
      <i className='fa fa-magic' />
    </div>
  )

  renderPathSelector = () => this.props.paths ? (
    <div className={styles.nt__pathSelector}>
      {this.props.paths.map((path, index) => (
        <div
          key={index}
          className={styles.nt__path}
          onMouseEnter={this.handlePathSelect(path)}
          onMouseLeave={this.handlePathDeselect}
          style={{ height: path.count * 0.2 + 12 }}
        >
          {path.count}
        </div>
      ))}
    </div>
  ) : null

  renderGraph = () => (
    <Graph
      nodes={this.props.nodes}
      links={this.props.links}
      paths={this.props.paths}
      totalInputCount={this.props.totalInputCount}
      selectedPath={this.state.selectedPath}
      selectedNodeId={this.state.selectedNodeId}
      onNodeHover={this.handleNodeSelect}
      linkType={this.state.path ? 'path' : 'link'}
    />
  )

  render () {
    return (
      <div className={styles.nt}>
        {this.renderPathSelector()}
        {this.renderLineType()}
        {this.renderGraph()}
      </div>
    )
  }
}

export default ResultsByLoad
