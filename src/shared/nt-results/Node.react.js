import classNames from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Node.styl'

class Node extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    inputCount: PropTypes.number.isRequired,
    outputCount: PropTypes.number.isRequired,
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

  getIconName = type => {
    switch (type) {
      case 'load':
        return 'lightbulb-o'
      case 'APICall':
        return 'rocket'
      case 'click':
        return 'mouse-pointer'
    }
  }

  renderInfo = (type, info, dy, fontSize) => (
    <text
      className={styles[`nt__${type}`]}
      y={0}
      dy={dy}
      textAnchor='middle'
      alignmentBaseline='central'
      fontSize={fontSize}
    >
      {info}
    </text>
  )

  render () {
    const { type, data, size, inputCount, outputCount, x, y, fade } = this.props
    const className = classNames(styles.nt, {
      [styles['--fade']]: fade
    })

    return (
      <g className={className} transform={`translate(${x},${y})`}>
        <circle
          r={size / 2}
          className={styles.nt__area}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
        />
        <circle
          className={styles.nt__core}
          r={4}
          strokeWidth={size / 2}
        >
          <i className={`fa fa-${this.getIconName(type)}`} aria-hidden='true' />
        </circle>
        {this.renderInfo('type', type, size, size / 3 + 3)}
        {this.renderInfo('data', data, size * 1.2 + 5, size / 4 + 3)}
        {this.renderInfo('data', 'input:' + inputCount + ', output: ' + outputCount, size * 1.4 + 10, size / 4 + 3)}
      </g>
    )
  }
}

export default Node
