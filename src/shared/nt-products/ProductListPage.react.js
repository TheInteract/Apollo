import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

import { Loading } from '../nt-uikit'
import styles from './ProductListPage.styl'

class ProductListPage extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      products: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        })
      ).isRequired,
      loading: PropTypes.bool,
      error: PropTypes.bool
    }).isRequired
  }

  renderLoadingState = () => (
    <Loading />
  )

  renderProducts = () => this.props.data.products.map((product, index) => (
    <Link key={index} to={`/${product._id}`}>
      <div className={styles.nt__link}>{product.name}</div>
    </Link>
  ))

  render () {
    const loading = this.props.data.loading

    return (
      <div className={styles.nt}>
        <div className={styles.nt__products}>
          <div className={styles.nt__header}>Project List</div>
          {loading ? this.renderLoadingState() : this.renderProducts()}
        </div>
      </div>
    )
  }
}

export default ProductListPage
