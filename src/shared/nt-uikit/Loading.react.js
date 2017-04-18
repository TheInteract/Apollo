import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Loading.styl'

class Loading extends React.Component {
  static propTypes = {
    message: PropTypes.string,
    size: PropTypes.oneOf([ 'small', 'big' ]),
    loading: PropTypes.bool,
  }

  static defaultProps = {
    message: 'data fetching...',
    size: 'big',
    loading: true
  }

  render () {
    const { size, message, loading } = this.props
    return (
      <div className={classNames(
          styles.nt, {
            [styles['nt__big']]: size === 'big',
            [styles['nt--hide']]: loading && size === 'small'
          }
      )}>
        {loading && <div className={[ styles[`nt__loading-${size}`] ]} />}
        {message}
      </div>
    )
  }
}

export default Loading
