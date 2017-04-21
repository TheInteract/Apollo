import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import LinearGradient from './LinearGradient.react'
import styles from './Link.styl'

export const GET_DATA = {
  CURVE: (source, target, getNodeSize, arrowWidth) => {
    const dx = 150
    return `M ${source.x + getNodeSize(source).width / 2}, ${source.y}
      C ${source.x + dx}, ${source.y}
        ${target.x - dx + arrowWidth}, ${target.y}
        ${target.x - getNodeSize(target).width / 2 - arrowWidth}, ${target.y}`
  },
  // CURVE: (source, target, getNodeSize, arrowWidth) => {
  //   const dx = target.x > source.x ? 1 : -1
  //   const dy = target.y > source.y ? 1 : -1
  //   return `M ${source.x - (getNodeSize(source).width / 2) * dx}, ${source.y}
  //     C ${source.x + 50 * dx}, ${source.y}
  //       ${target.x - 50 * dx}, ${target.y - 50 * dy}
  //       ${target.x - (getNodeSize(target).width / 2 + arrowWidth) * dx},
  //         ${target.y - (getNodeSize(target).height / 2 + arrowWidth) * dx}`
  // },
  STEP: (source, target, getNodeSize, arrowWidth) => {
    const dx = target.x - source.x
    const dy = target.y - source.y
    const tdx = getNodeSize(target).width / 2 + arrowWidth
    const tdy = getNodeSize(target).height / 2
    return `M ${source.x}, ${source.y + (dy >= 0 ? -tdy : tdy)}
      C ${source.x}, ${source.y + (dy || -80)}
        ${target.x - (dx || 80)}, ${target.y}
        ${target.x + (dx >= 0 ? -tdx : tdx)}, ${target.y}`
  }
}

export const FADE = 'fade'
export const NORMAL = 'normal'

class Link extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    arrowWidth: PropTypes.number,
    apparent: PropTypes.oneOf([ FADE, NORMAL ]).isRequired,
    getNodeSize: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  renderGradient = (source, target) => (
    <LinearGradient
      id={`gradient-${this.props.index}`}
      xlinkHref='#gradient'
      angle={Math.atan2(source.y - target.y, source.x - target.x)}
    />
  )

  render () {
    const { index, source, target, arrowWidth, apparent } = this.props

    return (
      <g>
        {this.renderGradient(source, target)}
        <path
          className={classNames(styles.nt, styles[`--${apparent}`])}
          d={GET_DATA.CURVE(source, target, this.props.getNodeSize, arrowWidth)}
          markerEnd='url(#arrowHead)'
          stroke={`url(#gradient-${index})`}
          data={target._id + ', ' + source._id}
        />
      </g>
    )
  }
}

export default Link
