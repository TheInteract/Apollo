import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import CreateFeatureForm from './CreateFeatureForm.react'
import FeatureCard from './FeatureCard.react'

const queryFeatures = gql`
  query getFeatures($productId: String!) {
    features(productId: $productId) {
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
  graphql(queryFeatures, {
    options: ({ productId }) => ({ variables: { productId: productId } })
  })
)

class FeaturesPage extends React.Component {
  static propTypes = {
    productId: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape({
      features: React.PropTypes.arrayOf(
        React.PropTypes.shape({
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
    }).isRequired
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
