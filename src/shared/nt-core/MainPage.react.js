import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import FeaturesPage from '../nt-features/FeaturesPage.react'
import HomePage from '../nt-home/HomePage.react'
import styles from './MainPage.styl'

class MainPage extends React.Component {
  static propTypes = {
    match: React.PropTypes.shape({
      url: React.PropTypes.string.isRequired,
      params: React.PropTypes.object.isRequired,
    }).isRequired,
    product: React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
    }).isRequired
  }

  render () {
    return (
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {this.props.product.name}
          <Link to={this.props.match.url}>Home</Link>
          <Link to={`${this.props.match.url}/features`}>Features</Link>
        </div>
        <div className={styles.content}>
          <Route exact path={this.props.match.url} component={HomePage} />
          <Route
            path={`${this.props.match.url}/features`}
            render={() => <FeaturesPage productId={this.props.match.params.productId} />}
          />
        </div>
      </div>
    )
  }
}

export default MainPage
