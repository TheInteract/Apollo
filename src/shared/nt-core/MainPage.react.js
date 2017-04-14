import classNames from 'classnames'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { Route, withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'recompose'

import FeaturesPage from '../nt-features/FeaturesPage.react'
import HomePage from '../nt-home/HomePage.react'
import ResultsPage from '../nt-results/ResultsPage.react'
import styles from './MainPage.styl'

const queryProduct = gql`
  query getProduct($productId: String!) {
    product(_id: $productId) {
      _id
      name
    }
  }
`

const enhance = compose(
  withRouter,
  graphql(queryProduct, {
    options: ({ match }) => ({ variables: { productId: match.params.productId } })
  })
)

class MainPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
      isExact: PropTypes.bool.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      loading: PropTypes.bool,
      error: PropTypes.bool
    })
  }

  renderName = () => (
    <div className={styles.name}>
      {
        (!this.props.data.loading) && (
          this.props.data.product.name
        )
      }
    </div>
  )

  renderLink = (content, path = '') => (
    <NavLink
      to={`${this.props.match.url}${path}`}
      activeClassName={styles.activeLink}
      exact
    >
      <div className={styles.link}>
        <i className='fa fa-home' aria-hidden='true' />
        {content}
      </div>
    </NavLink>
  )

  render () {
    return (
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {this.renderName()}
          {this.renderLink('Home')}
          {this.renderLink('Features', '/features')}
          {this.renderLink('Results', '/results')}
        </div>
        {(this.props.data.loading) ? (
          <div className={classNames(styles.content, styles.block, styles.loader)}>
            <p>fetching data...</p>
          </div>
        ) : (
          <div className={styles.content}>
            <Route exact path={this.props.match.url} component={HomePage} />
            <Route
              path={`${this.props.match.url}/features`}
              render={() => <FeaturesPage productId={this.props.match.params.productId} />}
            />
            <Route
              path={`${this.props.match.url}/results`}
              render={() => <ResultsPage productId={this.props.match.params.productId} />}
            />
          </div>
        )}
      </div>
    )
  }
}

export default enhance(MainPage)
