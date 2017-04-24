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
    version: {
      type: new GraphQLObjectType({
        name: 'Version',
        fields: () => ({
          featureId: { type: new GraphQLNonNull(GraphQLString) },
          name: { type: new GraphQLNonNull(GraphQLString) },
        })
      }),
      resolve: root => root.version
    }
  })
})

export default GraphType
