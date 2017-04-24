import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import FeaturesPage from '../nt-features/FeaturesPage.react'
import HomePage from '../nt-home/HomePage.react'
import ResultsPageContainer from '../nt-results/ResultsPageContainer.react'
import styles from './MainPage.styl'

class MainPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
      isExact: PropTypes.bool.isRequired,
    }).isRequired,
    product: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }

  renderName = () => (
    <div className={styles.name}>
      {this.props.product.name}
    </div>
  )

  renderLink = (content, iconName, path = '') => (
    <NavLink
      to={`${this.props.match.url}${path}`}
      activeClassName={styles.activeLink}
      exact={path === ''}
    >
      <div className={styles.link}>
        <i className={`fa fa-${iconName}`} aria-hidden='true' />
        <span>{content}</span>
      </div>
    </NavLink>
  )

  renderSubRoutes = (to, Component) => {
    const productId = this.props.match.params.productId

    return (
      <Route
        path={`${this.props.match.url}/${to}`}
        render={() => <Component productId={productId} />}
      />
    )
  }

  render () {
    return (
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {this.renderName()}
          {this.renderLink('Home', 'home')}
          {this.renderLink('Features', 'flask', '/features')}
          {this.renderLink('Results', 'line-chart', '/results')}
        </div>
        <div className={styles.content}>
          <Route exact path={this.props.match.url} component={HomePage} />
          {this.renderSubRoutes('features', FeaturesPage)}
          {this.renderSubRoutes('results', ResultsPageContainer)}
        </div>
      </div>
    )
  }
}

export default MainPage
