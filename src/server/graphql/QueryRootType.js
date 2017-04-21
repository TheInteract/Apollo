import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import Mongodb from 'mongodb'

import * as Collections from '../mongodb/Collections'
import { generateLinks } from './LinkResolver'
import { generateNodes } from './NodeResolver'
import { FeatureType, LinkType, NodeType, ProductType, SessionType } from './types'

export const validateId = function (id) {
  return id.match(/^[0-9a-fA-F]{24}$/)
}

const QueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    product: {
      type: ProductType,
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => validateId(_id)
        ? Collections.findOne('product', {
          _id: Mongodb.ObjectId(_id)
        }) : null
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve: async (_) => {
        return Collections.find('product')
      }
    },
    feature: {
      type: FeatureType,
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => validateId(_id)
        ? Collections.findOne('feature', {
          _id: Mongodb.ObjectId(_id)
        }) : null
    },
    features: {
      type: new GraphQLList(FeatureType),
      args: { productId: { type: GraphQLString } },
      resolve: async (_, { productId }) => validateId(productId)
        ? Collections.find('feature', {
          productId: Mongodb.ObjectId(productId)
        }, { _id: -1 }) : []
    },
    sessions: {
      type: new GraphQLList(SessionType),
      args: { sessionTypeId: { type: GraphQLString } },
      resolve: async (_, { sessionTypeId }) => validateId(sessionTypeId)
        ? Collections.find('session', {
          sessionTypeId: Mongodb.ObjectId(sessionTypeId)
        }) : []
    },
    nodes: {
      type: new GraphQLList(NodeType),
      args: { sessionTypeId: { type: GraphQLString } },
      resolve: async (_, { sessionTypeId }) => {
        const sessions = validateId(sessionTypeId)
        ? await Collections.find('session', {
          sessionTypeId: Mongodb.ObjectId(sessionTypeId)
        }) : []

        return generateNodes(sessions)
      }
    },
    links: {
      type: new GraphQLList(LinkType),
      args: { sessionTypeId: { type: GraphQLString } },
      resolve: async (_, { sessionTypeId }) => {
        const sessions = validateId(sessionTypeId)
        ? await Collections.find('session', {
          sessionTypeId: Mongodb.ObjectId(sessionTypeId)
        }) : []

        return generateLinks(sessions)
      }
    }
  })
})

export default QueryRootType
