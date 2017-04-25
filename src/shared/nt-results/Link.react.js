import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { WIDTH as ARROW_WIDTH } from './ArrowHeadMarker.react'
import LinearGradient from './LinearGradient.react'
import styles from './Link.styl'

export const GET_DATA = {
  CURVE: (source, target, strokeWidth) => {
    if (source.x === target.x && source.y === target.y) {
      return `M ${source.x + source.size / 2}, ${source.y}
        C ${source.x + source.size * 1.5}, ${source.y}
          ${target.x}, ${target.y - target.size * 1.5}
          ${target.x}, ${target.y - target.size / 2 - (ARROW_WIDTH / 2 * strokeWidth)}`
    }

    const d = 10 * strokeWidth + 100
    return `M ${source.x + source.size / 2}, ${source.y}
      C ${source.x + d}, ${source.y}
        ${target.x - d + ARROW_WIDTH + strokeWidth}, ${target.y}
        ${target.x - target.size / 2 - (ARROW_WIDTH / 2 * strokeWidth)}, ${target.y}`
  },
  STEP: (source, target, strokeWidth) => {
    const dx = target.x - source.x
    const dy = target.y - source.y
    const tdx = ARROW_WIDTH / 2 + strokeWidth
    return `M ${source.x}, ${source.y}
      C ${source.x}, ${source.y + (dy || -80)}
        ${target.x - (dx || 80)}, ${target.y}
        ${target.x + (dx >= 0 ? -tdx : tdx)}, ${target.y}`
  }
}

class Link extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    source: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      inputCount: PropTypes.number.isRequired,
      outputCount: PropTypes.number.isRequired,
    }).isRequired,
    target: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      inputCount: PropTypes.number.isRequired,
      outputCount: PropTypes.number.isRequired,
    }).isRequired,
    totalInputCount: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    fade: PropTypes.bool,
  }

  renderGradient = (source, target) => (
    <LinearGradient
      id={`gradient-${this.props.index}`}
      xlinkHref='#gradient'
      angle={Math.atan2(source.y - target.y, source.x - target.x)}
    />
  )

  render () {
    const { index, source, target, count, totalInputCount, fade } = this.props
    const className = classNames(styles.nt, {
      [styles['--fade']]: fade
    })

    const strokeWidth = source._id === target._id ? 1
      : count / totalInputCount * 20

    return (
      <g className={className}>
        {this.renderGradient(source, target)}
        <path
          d={GET_DATA.CURVE(source, target, strokeWidth)}
          markerEnd='url(#arrowHead)'
          stroke={`url(#gradient-${index})`}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          data={target._id + ', ' + source._id}
        />
      </g>
    )
  }
}

// <text
//   dx={source.x + (target.x - source.x) / 2}
//   dy={source.y + (target.y - source.y) / 2}
//   textAnchor='middle'
// >
//   {count}
// </text>

export default Link
