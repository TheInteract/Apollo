import gql from 'graphql-tag'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import { Loading } from '../nt-uikit'
import CreateFeatureForm from './CreateFeatureForm.react'
import FeatureCard from './FeatureCard.react'

import styles from './FeaturesPage.styl'

const FEATURES_SUBSCRIPTION = gql`
  subscription onFeatureAdded ($productId: String!) {
    featureAdded (productId: $productId) {
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
      subscribeToMore: PropTypes.func,
    }).isRequired
  }

  componentDidMount () {
    this.props.data.subscribeToMore({
      document: FEATURES_SUBSCRIPTION,
      variables: { productId: this.props.productId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev

        const newFeature = subscriptionData.data.featureAdded

        return update(prev, { features: { $unshift: [ newFeature ] } })
      }
    })
  }

  renderLoadingState = () => (
    <Loading />
  )

  renderFeatures = (features) => features ? features.map((feature, index) => (
    <FeatureCard key={index} {...feature} />
  )) : null

  render () {
    const { features, loading } = this.props.data
    return (
      <div className={styles.nt}>
        Features Page
        <CreateFeatureForm productId={this.props.productId} />
        {loading ? this.renderLoadingState() : this.renderFeatures(features)}
      </div>
    )
  }
}

export default enhance(FeaturesPage)
