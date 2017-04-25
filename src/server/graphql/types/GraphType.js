import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { generateLinks, generateNodes, generatePaths } from '../ResolveHelper'
import { LinkType, NodeType, PathType } from '.'

const GraphType = new GraphQLObjectType({
  name: 'Graph',
  description: 'Graph type',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    nodes: {
      type: new GraphQLList(NodeType),
      resolve: ({ sessions, version }) => generateNodes(sessions, version)
    },
    links: {
      type: new GraphQLList(LinkType),
      resolve: ({ sessions, version }) => generateLinks(sessions, version)
    },
    paths: {
      type: new GraphQLList(PathType),
      resolve: ({ sessions, version }) => generatePaths(sessions, version)
    },
    v: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => root.version.name
    }
  })
})

export default GraphType
