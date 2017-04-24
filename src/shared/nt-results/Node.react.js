import classNames from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Node.styl'

class Node extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    fade: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  }

  static defaultProps = {
    onMouseEnter: _.noop(),
    onMouseLeave: _.noop()
  }

  renderInfo = (type, info, dy, fontSize) => (
    <text
      className={styles[`nt__${type}`]}
      y={this.props.height / 2}
      dy={dy}
      textAnchor='middle'
      fontSize={fontSize}
    >
      {info}
    </text>
  )

  render () {
    const { type, data, width, height, x, y, fade } = this.props
    const className = classNames(styles.nt, {
      [styles['--fade']]: fade
    })

    return (
      <g className={className} transform={`translate(${x},${y})`}>
        <rect
          x={-(width / 2)}
          y={-(height / 2)}
          rx={width / 5}
          ry={width / 5}
          width={width}
          height={height}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
        />
        {this.renderInfo('type', type, height * 0.3 + 4, height * 0.3 + 3)}
        {this.renderInfo('data', data, height * 0.5 + 8, height * 0.2 + 3)}
      </g>
    )
  }
}

export default Node
