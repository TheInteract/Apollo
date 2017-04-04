import classNames from 'classnames'
import React from 'react'

import styles from './FeatureCard.styl'

class FeatureCard extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    proportion: React.PropTypes.shape({
      A: React.PropTypes.number.isRequired,
      B: React.PropTypes.number.isRequired,
    }).isRequired,
    count: React.PropTypes.shape({
      A: React.PropTypes.number.isRequired,
      B: React.PropTypes.number.isRequired,
    }).isRequired,
    active: React.PropTypes.bool,
  }

  renderName = () => (
    <div className={styles.n__name}>
      {this.props.name}
    </div>
  )

  renderHeader = () => (
    <div className={styles.n__header}>
      {this.renderName()}
      <div>
        {this.props.active ? 'Active' : 'Closed'}
      </div>
    </div>
  )

  renderExpected = version => (
    <div className={styles.n__expected}>
      Expected {version}: {this.props.proportion[version]}%
    </div>
  )

  renderActual = version => {
    const count = this.props.count[version]
    return (
      <div className={styles.n__actual}>
        Actual: {count} user{count > 1 ? 's' : ''}
      </div>
    )
  }

  renderProportion = () => (
    <div className={styles.n__proportion}>
      <div className={styles.n__A}>
        {this.renderExpected('A')}
        {this.renderActual('A')}
      </div>
      <div className={styles.n__B}>
        {this.renderExpected('B')}
        {this.renderActual('B')}
      </div>
    </div>
  )

  render () {
    const className = classNames(styles.n, {
      [styles['--closed']]: !this.props.active,
    })

    return (
      <div className={className}>
        {this.renderHeader()}
        {this.renderProportion()}
      </div>
    )
  }
}

export default FeatureCard
