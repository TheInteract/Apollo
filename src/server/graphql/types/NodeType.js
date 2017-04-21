import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import removeInteractClick from './removeInteractClick'

const NodeType = new GraphQLObjectType({
  name: 'Node',
  description: 'Node type',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    data: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: _ => _.url || removeInteractClick(_.target) || _.endpoint
    },
    count: { type: new GraphQLNonNull(GraphQLInt) },
  })
})

export default NodeType
