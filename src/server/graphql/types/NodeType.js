import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { removeInteractClick } from '../ResolveHelper'

const NodeType = new GraphQLObjectType({
  name: 'Node',
  description: 'Node type',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => root.actionTypeId
    },
    type: { type: new GraphQLNonNull(GraphQLString) },
    data: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => root.url || removeInteractClick(root.target) || root.endpoint
    },
    count: { type: GraphQLInt },
    v: { type: GraphQLString }
  })
})

export default NodeType
