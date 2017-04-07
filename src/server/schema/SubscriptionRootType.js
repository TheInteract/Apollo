import { GraphQLObjectType, GraphQLString } from 'graphql'

import { FeatureType } from './types'

const SubscriptionRootType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    featureAdded: {
      type: FeatureType,
      args: { productId: { type: GraphQLString } },
      resolve: (_) => {
        console.log('_', _)
        return _
      }
    }
  }
})

export default SubscriptionRootType
