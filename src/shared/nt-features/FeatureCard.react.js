import classNames from 'classnames'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import styles from './FeatureCard.styl'

const closeFeature = gql`
  mutation closeFeature($_id: String!) {
    closeFeature(_id: $_id) {
      _id
      active
    }
  }
`

const enhance = compose(
  graphql(closeFeature)
)

class FeatureCard extends React.Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    proportion: PropTypes.shape({
      A: PropTypes.number.isRequired,
      B: PropTypes.number.isRequired,
    }).isRequired,
    count: PropTypes.shape({
      A: PropTypes.number.isRequired,
      B: PropTypes.number.isRequired,
    }).isRequired,
    active: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.state = { showCloseConfirmation: false }
  }

  hideCloseConfirmation = () => {
    this.setState({ showCloseConfirmation: false })
  }

  showCloseConfirmation = () => {
    this.setState({ showCloseConfirmation: true })
  }

  handleClose = () => {
    this.hideCloseConfirmation()
    this.props.mutate({ variables: { _id: this.props._id } })
  }

  renderName = () => (
    <div className={styles.nt__name}>
      {this.props.name}
    </div>
  )

  renderCloseButton = () => this.state.showCloseConfirmation ? (
    <div className={styles.nt__closeConfirmation}>
      Do you want to close this experiment?
      <div className={styles.nt__closeButton} onClick={this.handleClose}>
        Close
      </div>
      <div className={styles.nt__closeButton} onClick={this.hideCloseConfirmation}>
        Cancel
      </div>
    </div>
  ) : (
    <div className={styles.nt__closeButton} onClick={this.showCloseConfirmation}>
      Close
    </div>
  )

  renderClosedLabel = () => <div>Closed</div>

  renderHeader = () => (
    <div className={styles.nt__header}>
      {this.renderName()}
      {this.props.active ? this.renderCloseButton() : this.renderClosedLabel()}
    </div>
  )

  renderExpected = version => (
    <div className={styles.nt__expected}>
      Expected {version}: {this.props.proportion[version]}%
    </div>
  )

  renderActual = version => {
    const count = this.props.count[version]
    return (
      <div className={styles.nt__actual}>
        Actual: {count} user{count > 1 ? 's' : ''}
      </div>
    )
  }

  renderProportion = () => (
    <div className={styles.nt__proportion}>
      <div className={styles.nt__A}>
        {this.renderExpected('A')}
        {this.renderActual('A')}
      </div>
      <div className={styles.nt__B}>
        {this.renderExpected('B')}
        {this.renderActual('B')}
      </div>
    </div>
  )

  render () {
    const className = classNames(styles.nt, {
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

export default enhance(FeatureCard)
