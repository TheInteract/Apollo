import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { NodeType } from '.'

const PathType = new GraphQLObjectType({
  name: 'Path',
  description: 'Path type',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    nodes: {
      type: new GraphQLList(NodeType),
      resolve: _ => _.actions
    },
    count: { type: new GraphQLNonNull(GraphQLInt) },
  })
})

export default PathType
