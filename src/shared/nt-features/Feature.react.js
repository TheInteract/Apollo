import React from 'react'

import styles from './Feature.styl'

class Feature extends React.Component {
  static propTypes = {
    feature: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      proportion: React.PropTypes.shape({
        A: React.PropTypes.number.isRequired,
        B: React.PropTypes.number.isRequired,
      }).isRequired,
      count: React.PropTypes.shape({
        A: React.PropTypes.number.isRequired,
        B: React.PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  }

  render () {
    return (
      <div className={styles.container}>
        Name: {this.props.feature.name}
        <div className={styles.proportionContainer}>
          <div className={styles.proportion}>
            <div>
              Expected A: {this.props.feature.proportion.A}%
            </div>
            <div>
              Actual A: {this.props.feature.count.A} users
            </div>
          </div>
          <div className={styles.proportion}>
            <div>
              Expected B: {this.props.feature.proportion.B}%
            </div>
            <div>
              Actual B: {this.props.feature.count.B} users
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Feature
