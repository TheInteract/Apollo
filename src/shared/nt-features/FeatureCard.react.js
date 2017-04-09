import classNames from 'classnames'
import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import styles from './FeatureCard.styl'

// const FEATURE_SUBSCRIPTION = gql`
//   subscription onFeatureClosed {
//     featureClosed {
//       active
//     }
//   }
// `

const closeFeature = gql`
  mutation closeFeature($_id: String!) {
    closeFeature(_id: $_id)
  }
`

const enhance = compose(
  graphql(closeFeature)
)

class FeatureCard extends React.Component {
  static propTypes = {
    mutate: React.PropTypes.func.isRequired,
    _id: React.PropTypes.string.isRequired,
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
    // subscribeToMore: React.PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = { showCloseConfirmation: false }
  }

  // componentDidMount () {
  //   console.log('subscribeToMore', this.props.subscribeToMore)
  // }

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
    <div className={styles.n__name}>
      {this.props.name}
    </div>
  )

  renderCloseButton = () => this.state.showCloseConfirmation ? (
    <div className={styles.n__closeConfirmation}>
      Do you want to close this experiment?
      <div className={styles.n__closeButton} onClick={this.handleClose}>
        Close
      </div>
      <div className={styles.n__closeButton} onClick={this.hideCloseConfirmation}>
        Cancel
      </div>
    </div>
  ) : (
    <div className={styles.n__closeButton} onClick={this.showCloseConfirmation}>
      Close
    </div>
  )

  renderClosedLabel = () => <div>Closed</div>

  renderHeader = () => (
    <div className={styles.n__header}>
      {this.renderName()}
      {this.props.active ? this.renderCloseButton() : this.renderClosedLabel()}
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

export default enhance(FeatureCard)
