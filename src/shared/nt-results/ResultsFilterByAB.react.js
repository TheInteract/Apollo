import * as d3 from 'd3'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ResultsByLoadContainer from './ResultsByLoadContainer.react'
import styles from './ResultsFilterByAB.styl'

class ResultsFilterByAB extends React.Component {
  static propTypes = {
    sessionTypeId: PropTypes.string.isRequired,
    featureId: PropTypes.string.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = { x: 0 }
  }

  componentDidMount () {
    if (this.container) {
      this.setState({ x: this.container.clientWidth / 2 })
    }
  }

  dragged = () => {
    const x = d3.event.x
    this.setState({
      x: x < 0 ? 0 : x > this.container.clientWidth
        ? this.container.clientWidth : x
    })
  }

  renderResults = (version, style) => (
    <div key={version} className={styles[`nt__${version}`]} style={style}>
      <ResultsByLoadContainer
        key={version}
        sessionTypeId={this.props.sessionTypeId}
        featureId={this.props.featureId}
        versionName={version}
      />
    </div>
  )

  renderABGraphs = () => ([
    this.renderResults('A', { width: `${this.state.x}px` }),
    <div
      key='divider'
      className={styles.nt__divider}
      style={{ transform: `translateX(${this.state.x}px)` }}
      ref={c => { d3.select(c).call(d3.drag().on('drag', this.dragged)) }}
    />,
    this.renderResults('B', { left: `${this.state.x}px` }),
  ])

  render () {
    return (
      <div ref={c => { this.container = c }}>
        {this.renderABGraphs()}
      </div>
    )
  }
}

export default ResultsFilterByAB
