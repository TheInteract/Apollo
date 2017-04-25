import classNames from 'classnames'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Path.styl'

class Path extends React.Component {
  static propTypes = {
    path: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nodes: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
      })).isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired,
    findNode: PropTypes.func.isRequired,
    fade: PropTypes.bool,
  }

  render () {
    const className = classNames(styles.nt, {
      [styles['--fade']]: this.props.fade
    })

    const line = d3.line()
      .x(d => this.props.findNode(d._id).x)
      .y(d => this.props.findNode(d._id).y)
      .curve(d3.curveCardinal.tension(0))

    return (
      <g className={className}>
        <path
          className={styles.nt}
          d={line(this.props.path.nodes)}
          stroke={`url(#gradient)`}
          strokeWidth={this.props.path.count * 2}
          strokeLinecap='round'
          fill='none'
        />
      </g>
    )
  }
}

export default Path
