import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import CreateFeatureForm from './CreateFeatureForm.react'
import FeatureCard from './FeatureCard.react'

const FEATURES_SUBSCRIPTION = gql`
  subscription onFeatureAdded($productId: String!){
    featureAdded(productId: $productId){
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
  query queryFeatures($productId: String!) {
    features(productId: $productId) {
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
    productId: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape({
      features: React.PropTypes.arrayOf(
        React.PropTypes.shape({
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
        }).isRequired,
      ),
      subscribeToMore: React.PropTypes.func,
    }).isRequired
  }

  componentDidMount () {
    this.props.data.subscribeToMore({
      document: FEATURES_SUBSCRIPTION,
      variables: { productId: this.props.productId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev

        const newFeature = subscriptionData.data.featureAdded

        return {
          ...prev,
          features: [ newFeature, ...prev.features ]
        }
      }
    })
  }

  renderFeatures = (features) => features ? features.map((feature, index) => (
    <FeatureCard key={index} {...feature} />
  )) : null

  render () {
    return (
      <div>
        Features Page
        <CreateFeatureForm productId={this.props.productId} />
        {this.renderFeatures(this.props.data.features)}
      </div>
    )
  }
}

export default enhance(FeaturesPage)
