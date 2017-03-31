import {
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
  description: 'This represent an feature',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString }
  })
})

const QueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    feature: {
      type: FeatureType,
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => await Collections.findOne('features', {
        _id: Mongodb.ObjectId(_id)
      })
    },
    features: {
      type: new GraphQLList(FeatureType),
      resolve: async () => await Collections.find('features')
    }
  })
})

const Schema = new GraphQLSchema({
  query: QueryRootType,
})

export default Schema
