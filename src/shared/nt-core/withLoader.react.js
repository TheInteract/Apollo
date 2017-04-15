import PropTypes from 'prop-types'
import React from 'react'
import { Redirect } from 'react-router-dom'

import styles from './withLoader.styl'

const redirect = () => <Redirect to={{ pathname: '/product' }} />

function handleError (isError = () => false, HandleError = redirect) {
  return function (Component) {
    return (props) => isError(props) ? <HandleError /> : <Component {...props} />
  }
}

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

export { withLoader, handleError }
