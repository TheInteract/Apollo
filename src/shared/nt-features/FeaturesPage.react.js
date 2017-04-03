import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import CreateFeatureForm from './CreateFeatureForm.react'
import Feature from './Feature.react'

const queryFeatures = gql`
  query getFeatures($productId: String!) {
    features(productId: $productId) {
      name
      proportion {
        A
        B
      }
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
    data: React.PropTypes.shape({
      features: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          name: React.PropTypes.string.isRequired,
          proportion: React.PropTypes.shape({
            A: React.PropTypes.number.isRequired,
            B: React.PropTypes.number.isRequired,
          }).isRequired,
        }).isRequired,
      ),
    }).isRequired
  }

  renderFeatures = (features) => features ? features.map((feature, index) => (
    <Feature key={index} feature={feature} />
  )) : null

  render () {
    return (
      <div>
        Features Page
        <CreateFeatureForm />
        {this.renderFeatures(this.props.data.features)}
      </div>
    )
  }
}

export default enhance(FeaturesPage)
