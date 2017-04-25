import url from 'url'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import ResultsByLoadContainer from './ResultsByLoadContainer.react'
import ResultsFilterByAB from './ResultsFilterByAB.react'
import styles from './ResultsPage.styl'

class ResultsPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
      isExact: PropTypes.bool.isRequired,
    }).isRequired,
    sessionTypes: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
    features: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
  }

  state = { selectedFeatureId: undefined }

  toggleSelectFeature = featureId => () => {
    this.setState({
      selectedFeatureId: this.state.selectedFeatureId === featureId
        ? undefined : featureId
    })
  }

  renderSetting = () => <div />

  renderLink = (content, iconName, path = '') => (
    <NavLink
      key={path}
      to={`${this.props.match.url}${path}`}
      activeClassName={styles.nt__activeLink}
      exact
    >
      <div className={styles.nt__link}>
        <i className={`fa fa-${iconName}`} aria-hidden='true' />
        <span>{content}</span>
      </div>
    </NavLink>
  )

  renderResults = sessionTypeId => () => this.state.selectedFeatureId ? (
    <ResultsFilterByAB
      sessionTypeId={sessionTypeId}
      featureId={this.state.selectedFeatureId}
    />
  ) : (
    <ResultsByLoadContainer sessionTypeId={sessionTypeId} />
  )

  renderSubRoutes = (sessionTypeId, Component) => (
    <Route
      key={sessionTypeId}
      path={`${this.props.match.url}/${sessionTypeId}`}
      render={this.renderResults(sessionTypeId)}
    />
  )

  render () {
    return (
      <div className={styles.nt}>
        <div className={styles.nt__nav}>
          {this.renderLink('setting', 'cog')}
          <div className={styles.nt__divider} />
          {this.props.sessionTypes.map(sessionType => (
            this.renderLink(url.parse(sessionType.url).path, 'tag', `/${sessionType._id}`)
          ))}
          <div className={styles.nt__divider} />
          {this.props.features.map(feature => (
            <div
              className={classNames(styles.nt__filter, {
                [styles['--active']]: this.state.selectedFeatureId === feature._id
              })}
              key={feature._id}
              onClick={this.toggleSelectFeature(feature._id)}
            >
              {feature.name}
            </div>
          ))}
        </div>
        <div className={styles.nt__content}>
          <Route exact path={this.props.match.url} render={this.renderSetting} />
          {this.props.sessionTypes.map(sessionType => (
            this.renderSubRoutes(sessionType._id)
          ))}
        </div>
      </div>
    )
  }
}

export default ResultsPage
