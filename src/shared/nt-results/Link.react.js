import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { WIDTH as ARROW_WIDTH } from './ArrowHeadMarker.react'
import LinearGradient from './LinearGradient.react'
import styles from './Link.styl'

export const GET_DATA = {
  CURVE: (source, target, getNodeSize, strokeWidth) => {
    const sourceWidth = getNodeSize(source).width
    const targetWidth = getNodeSize(target).width
    const targetHeight = getNodeSize(target).height

    if (source.x === target.x && source.y === target.y) {
      const d = 5 * strokeWidth + 25
      return `M ${source.x + sourceWidth / 2}, ${source.y}
        C ${source.x + d}, ${source.y}
          ${target.x}, ${target.y - d}
          ${target.x}, ${target.y - targetHeight / 2 - (ARROW_WIDTH / 2 * strokeWidth)}`
    }

    const d = 10 * strokeWidth + 100
    return `M ${source.x + sourceWidth / 2}, ${source.y}
      C ${source.x + d}, ${source.y}
        ${target.x - d + ARROW_WIDTH + strokeWidth}, ${target.y}
        ${target.x - targetWidth / 2 - (ARROW_WIDTH / 2 * strokeWidth)}, ${target.y}`
  },
  STEP: (source, target, getNodeSize, strokeWidth) => {
    const dx = target.x - source.x
    const dy = target.y - source.y
    const tdx = getNodeSize(target).width / 2 + ARROW_WIDTH / 2 + strokeWidth
    const tdy = getNodeSize(target).height / 2
    return `M ${source.x}, ${source.y + (dy >= 0 ? -tdy : tdy)}
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
    }).isRequired,
    target: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    count: PropTypes.number.isRequired,
    fade: PropTypes.bool,
    getNodeSize: PropTypes.func.isRequired,
  }

  renderGradient = (source, target) => (
    <LinearGradient
      id={`gradient-${this.props.index}`}
      xlinkHref='#gradient'
      angle={Math.atan2(source.y - target.y, source.x - target.x)}
    />
  )

  render () {
    const { index, source, target, count, fade } = this.props
    const className = classNames(styles.nt, {
      [styles['--fade']]: fade
    })
    const strokeWidth = count / 2

    return (
      <g>
        {this.renderGradient(source, target)}
        <path
          className={className}
          d={GET_DATA.CURVE(source, target, this.props.getNodeSize, strokeWidth)}
          markerEnd='url(#arrowHead)'
          stroke={`url(#gradient-${index})`}
          strokeWidth={strokeWidth}
          data={target._id + ', ' + source._id}
        />
      </g>
    )
  }
}

export default Link
