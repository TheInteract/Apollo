import classNames from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Node.styl'

export const FADE = 'fade'
export const NORMAL = 'normal'

class Node extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    apparent: PropTypes.oneOf([ NORMAL, FADE ]),
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  }

  static defaultProps = {
    apparent: NORMAL,
    onMouseEnter: _.noop(),
    onMouseLeave: _.noop()
  }

  render () {
    const { type, data, width, height, x, y, apparent } = this.props
    const className = classNames(styles.nt, styles[`--${apparent}`])

    return (
      <g className={className} transform={`translate(${x},${y})`}>
        <rect
          x={-(width / 2)}
          y={-(height / 2)}
          width={width}
          height={height}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
        />
        <text y={height / 2} dy={18} textAnchor='middle'>{type}</text>
        <text y={height / 2} dy={36} textAnchor='middle'>{data}</text>
      </g>
    )
  }
}

export default Node
