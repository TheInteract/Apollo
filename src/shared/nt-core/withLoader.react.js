import PropTypes from 'prop-types'
import React from 'react'

import styles from './withLoader.styl'

function withLoader (Component) {
  return class extends React.Component {
    static propTypes = {
      data: PropTypes.shape({
        loading: PropTypes.bool,
        error: PropTypes.bool
      }).isRequired
    }

    render () {
      return (this.props.data.loading) ? (
        <div className={styles.loader}>
          <p>data fetching...</p>
        </div>
      ) : (
        <Component {...this.props} />
      )
    }
  }
}

export { withLoader }
