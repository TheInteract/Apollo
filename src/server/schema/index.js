import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import Mongodb from 'mongodb'

import * as Collections from '../mongodb/Collections'

const FeatureType = new GraphQLObjectType({
  name: 'Feature',
  description: 'Feature',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    proportion: {
      type: new GraphQLObjectType({
        name: 'Proportion',
        fields: () => ({
          A: { type: GraphQLInt },
          B: { type: GraphQLInt },
        })
      }),
      resolve: (_) => _.proportion
    }
  })
})

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Product',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    API_KEY_PRIVATE: { type: new GraphQLNonNull(GraphQLString) },
    API_KEY_PUBLIC: { type: new GraphQLNonNull(GraphQLString) },
    domainName: { type: new GraphQLNonNull(GraphQLString) },
  })
})

const QueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    product: {
      type: ProductType,
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => {
        return _id.match(/^[0-9a-fA-F]{24}$/)
          ? await Collections.findOne('product', {
            _id: Mongodb.ObjectId(_id)
          }) : null
      }
    },
    feature: {
      type: FeatureType,
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => {
        return _id.match(/^[0-9a-fA-F]{24}$/)
          ? await Collections.findOne('feature', {
            _id: Mongodb.ObjectId(_id)
          }) : null
      }
    },
    features: {
      type: new GraphQLList(FeatureType),
      args: { productId: { type: GraphQLString } },
      resolve: async (_, { productId }) => {
        return productId.match(/^[0-9a-fA-F]{24}$/)
          ? await Collections.find('feature', {
            productId: Mongodb.ObjectId(productId)
          }) : []
      }
    }
  })
})

const MutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createFeature: {
      type: FeatureType,
      description: 'Create a new feature',
      args: {
        productId: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        proportion: {
          type: new GraphQLInputObjectType({
            name: 'InputProportion',
            fields: () => ({
              A: { type: GraphQLInt, defaultValue: 50 },
              B: { type: GraphQLInt, defaultValue: 50 },
            })
          })
        },
      },
      resolve: async (_, { productId, ...args }) => {
        return await Collections.insertOne('feature', {
          productId: Mongodb.ObjectId(productId),
          ...args
        })
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: QueryRootType,
  mutation: MutationRootType,
})

export default Schema
