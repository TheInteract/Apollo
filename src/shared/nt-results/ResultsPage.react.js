import url from 'url'

import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import ResultsByLoad from './ResultsByLoad.react'
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
  }

  renderSetting = () => <div />

  renderLink = (content, path = '') => (
    <NavLink
      key={path}
      to={`${this.props.match.url}${path}`}
      activeClassName={styles.nt__activeLink}
      exact
    >
      <div className={styles.nt__link}>
        <i className='fa fa-home' aria-hidden='true' />
        {content}
      </div>
    </NavLink>
  )

  renderSubRoutes = (sessionTypeId, Component) => (
    <Route
      key={sessionTypeId}
      path={`${this.props.match.url}/${sessionTypeId}`}
      render={() => <ResultsByLoad sessionTypeId={sessionTypeId} />}
    />
  )

  render () {
    return (
      <div className={styles.nt}>
        <div className={styles.nt__sidebar}>
          {this.renderLink('setting')}
          {this.props.sessionTypes.map(sessionType => (
            this.renderLink(url.parse(sessionType.url).path, `/${sessionType._id}`)
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
