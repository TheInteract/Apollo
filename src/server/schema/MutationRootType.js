import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import Mongodb from 'mongodb'

import * as Collections from '../mongodb/Collections'
import pubsub from '../subscriptions/pubsub'
import { FeatureType } from './types'

const ProportionInputType = new GraphQLInputObjectType({
  name: 'InputProportion',
  fields: () => ({
    A: { type: GraphQLInt, defaultValue: 50 },
    B: { type: GraphQLInt, defaultValue: 50 },
  })
})

const MutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createFeature: {
      type: FeatureType,
      description: 'Create a new feature',
      args: {
        productId: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        proportion: { type: ProportionInputType },
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
      type: GraphQLBoolean,
      description: 'Close a feature',
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => Collections.update('feature', {
        _id: Mongodb.ObjectId(_id)
      }, { $set: { active: false } })
    }
  })
})

export default MutationRootType
