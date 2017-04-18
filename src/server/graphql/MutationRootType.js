import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import Mongodb from 'mongodb'

import * as Collections from '../mongodb/Collections'
import pubsub from '../subscriptions/pubsub'
import { FeatureType, InputProportionType } from './types'

const MutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createFeature: {
      type: FeatureType,
      description: 'Create a new feature',
      args: {
        productId: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        proportion: { type: InputProportionType },
        active: { type: GraphQLBoolean, defaultValue: true },
      },
      resolve: async (_, { productId, ...args }) => {
        const addedFeature = await Collections.insertOne('feature', {
          productId: Mongodb.ObjectId(productId),
          ...args
        })
        pubsub.publish('featureAdded', addedFeature)
        return addedFeature
      }
    },
    closeFeature: {
      type: FeatureType,
      description: 'Close a feature',
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => {
        const updatedFeature = await Collections.update('feature', {
          _id: Mongodb.ObjectId(_id)
        }, { $set: { active: false } })
        pubsub.publish('featureChanged', updatedFeature.value)
        return updatedFeature.value
      }
    }
  })
})

export default MutationRootType
