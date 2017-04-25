import * as d3 from 'd3'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './ResultsFilterByAB.styl'

class ResultsFilterByAB extends React.Component {
  static propTypes = {
    resultA: PropTypes.node.isRequired,
    resultB: PropTypes.node.isRequired,
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
    <div className={styles[`nt__${version}`]} style={style}>
      {this.props[`result${version}`]}
    </div>
  )

  render () {
    void this.props.resultA
    void this.props.resultB
    return (
      <div ref={c => { this.container = c }}>
        {this.renderResults('A', { width: `${this.state.x - 5}px` })}
        <div
          className={styles.nt__divider}
          style={{ transform: `translateX(${this.state.x}px)` }}
          ref={c => { d3.select(c).call(d3.drag().on('drag', this.dragged)) }}
        />
        {this.renderResults('B', { left: `${this.state.x + 5}px` })}
      </div>
    )
  }
}

export default ResultsFilterByAB
