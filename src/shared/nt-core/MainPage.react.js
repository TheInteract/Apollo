import React from 'react'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import FeaturesPage from '../nt-features/FeaturesPage.react'
import HomePage from '../nt-home/HomePage.react'
import ResultsPage from '../nt-results/ResultsPage.react'
import styles from './MainPage.styl'

class MainPage extends React.Component {
  static propTypes = {
    match: React.PropTypes.shape({
      url: React.PropTypes.string.isRequired,
      params: React.PropTypes.object.isRequired,
      isExact: React.PropTypes.bool.isRequired,
    }).isRequired,
    product: React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
    }).isRequired
  }

  renderName = () => (
    <div className={styles.name}>
      {this.props.product.name}
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
      </div>
    )
  }
}

export default MainPage
