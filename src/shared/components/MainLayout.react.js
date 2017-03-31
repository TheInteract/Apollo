import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'

import styles from './MainLayout.styl'

const withFeatures = gql`
  query getFeatures {
    feature {
      _id
      name
    }
  }
`

class MainLayout extends React.Component {
  static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool.isRequired,
      feature: React.PropTypes.array,
    }).isRequired,
  }

  renderFeatures = (features) => features ? features.map(feature => (
    <div key={feature._id}>{feature.name}</div>
  )) : null

  render () {
    return (
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          Sidebar...
        </div>
        <div className={styles.content}>
          {this.renderFeatures(this.props.data.feature)}
        </div>
      </div>
    )
  }
}

export default graphql(withFeatures)(MainLayout)
