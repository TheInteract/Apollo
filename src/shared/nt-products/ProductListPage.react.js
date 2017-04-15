import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'

import styles from './ProductListPage.styl'

class ResultsPage extends React.Component {
  static propTypes = {
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired
  }

  render () {
    return (
      <div className={classNames(styles.column, styles.column__half, styles['column__offset-one-quarter'])}>
        <div className={styles.panel__head}>Project List</div>
        {this.props.products.map(
            (p, index) => <NavLink to={`/products/${p._id}`} className={styles.panel__block} key={index}>{p.name}</NavLink>
        )}
      </div>
    )
  }
}

export default ResultsPage
