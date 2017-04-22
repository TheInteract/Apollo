import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import CreateFeatureForm from './CreateFeatureForm.react'
import FeatureCard from './FeatureCard.react'
import styles from './FeaturesPage.styl'

const FEATURES_QUERY = gql`
  query queryFeatures ($productId: String!) {
    features (productId: $productId) {
      _id
      name
      proportion {
        A
        B
      }
      count {
        A
        B
      }
      active
    }
  }
`

const enhance = compose(
  withRouter,
  graphql(FEATURES_QUERY, {
    options: ({ productId }) => ({ variables: { productId: productId } })
  })
)

class FeaturesPage extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    data: PropTypes.shape({
      features: PropTypes.arrayOf(
        PropTypes.shape({
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
        }).isRequired,
      ),
      loading: PropTypes.bool,
      subscribeToMore: PropTypes.func
    }).isRequired
  }

  renderLoadingState = () => (
    <div className={styles.nt__loadingState}>
      <Loading message='data fetching...' />
    </div>
  )

  renderFeatures = (features) => features ? features.map((feature, index) => (
    <FeatureCard key={index} {...feature} />
  )) : null

  render () {
    const { features, loading } = this.props.data
    return (
      <div className={styles.nt}>
        <div className={styles.nt__create}>
          <CreateFeatureForm productId={this.props.productId} />
        </div>
        {loading ? this.renderLoadingState() : this.renderFeatures(features)}
      </div>
    )
  }
}

export default enhance(FeaturesPage)
