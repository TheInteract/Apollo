import classNames from 'classnames'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'recompose'

import { withLoader } from '../nt-core/withLoader.react'
import styles from './ProductListPage.styl'

const PRODUCTS_QUERY = gql`
  query queryProducts {
    products {
      _id
      name
    }
  }
`

const enhance = compose(
  withRouter,
  graphql(PRODUCTS_QUERY),
  withLoader
)

class ResultsPage extends React.Component {
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
    })
  }

  render () {
    return (
      <div className={classNames(styles.column, styles.column__half, styles['column__offset-one-quarter'])}>
        <div className={styles.panel__head}>Project List</div>
        {this.props.data.products.map(
            (p, index) => <NavLink to={`/products/${p._id}`} className={styles.panel__block} key={index}>{p.name}</NavLink>
        )}
      </div>
    )
  }
}

export default enhance(ResultsPage)
