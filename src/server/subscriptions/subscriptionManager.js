import { SubscriptionManager } from 'graphql-subscriptions'

import schema from '../graphql/schema'
import pubsub from './pubsub'

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    featureAdded: (options, { productId }) => ({
      featureAdded: {
        filter: feature => feature.productId.toString() === productId
      },
    }),
  },
})

export default subscriptionManager
