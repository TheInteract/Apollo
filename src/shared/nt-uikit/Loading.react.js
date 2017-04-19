import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Loading.styl'

class Loading extends React.Component {
  static propTypes = {
    message: PropTypes.string,
    size: PropTypes.oneOf([ 'small', 'big' ]),
  }

  static defaultProps = {
    size: 'big',
  }

  render () {
    return (
      <div className={classNames(styles.nt, styles[`--${this.props.size}`])}>
        <div className={styles.nt__loading} />
        {this.props.message}
      </div>
    )
  }
}

export default Loading
