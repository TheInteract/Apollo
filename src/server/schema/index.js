import {
  // GraphQLEnumType,
  // GraphQLFloat,
  // GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'

import Features from '../mockData/Features'

const Feature = new GraphQLObjectType({
  name: 'Feature',
  description: 'This represent an feature',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString }
  })
})

const Query = new GraphQLObjectType({
  name: 'TestSchema',
  description: 'Root of the Test Schema',
  fields: () => ({
    feature: {
      type: new GraphQLList(Feature),
      args: {
        _id: { type: GraphQLString }
      },
      resolve: function () {
        return Features
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
