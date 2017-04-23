import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import Mongodb from 'mongodb'

import * as Collections from '../mongodb/Collections'
import { generateLinks, generateNodes, generatePaths } from './ResolveHelper'
import {
  FeatureType,
  InputVersionType,
  LinkType,
  NodeType,
  PathType,
  ProductType,
  SessionType,
  SessionTypeType,
} from './types'

export const validateId = function (id) {
  return id.match(/^[0-9a-fA-F]{24}$/)
}

const QueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    product: {
      type: ProductType,
      args: { _id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (root, { _id }) => validateId(_id)
        ? Collections.findOne('product', {
          _id: Mongodb.ObjectId(_id)
        }) : null
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve: async (root) => {
        return Collections.find('product')
      }
    },
    feature: {
      type: FeatureType,
      args: { _id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (root, { _id }) => validateId(_id)
        ? Collections.findOne('feature', {
          _id: Mongodb.ObjectId(_id)
        }) : null
    },
    features: {
      type: new GraphQLList(FeatureType),
      args: { productId: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (root, { productId }) => validateId(productId)
        ? Collections.find('feature', {
          productId: Mongodb.ObjectId(productId)
        }, { _id: -1 }) : []
    },
    sessionTypes: {
      type: new GraphQLList(SessionTypeType),
      args: { productId: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (root, { productId }) => validateId(productId)
        ? Collections.find('sessionType', {
          productId: Mongodb.ObjectId(productId)
        }) : []
    },
    sessions: {
      type: new GraphQLList(SessionType),
      args: { sessionTypeId: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (root, { sessionTypeId }) => validateId(sessionTypeId)
        ? Collections.find('session', {
          sessionTypeId: Mongodb.ObjectId(sessionTypeId)
        }) : []
    },
    nodes: {
      type: new GraphQLList(NodeType),
      args: {
        sessionTypeId: { type: new GraphQLNonNull(GraphQLString) },
        inputVersion: { type: InputVersionType }
      },
      resolve: async (root, { sessionTypeId, inputVersion }) => {
        const sessions = validateId(sessionTypeId)
          ? await Collections.find('session', {
            sessionTypeId: Mongodb.ObjectId(sessionTypeId)
          }) : []

        return generateNodes(sessions, inputVersion)
      }
    },
    links: {
      type: new GraphQLList(LinkType),
      args: {
        sessionTypeId: { type: new GraphQLNonNull(GraphQLString) },
        inputVersion: { type: InputVersionType }
      },
      resolve: async (root, { sessionTypeId, inputVersion }) => {
        const sessions = validateId(sessionTypeId)
          ? await Collections.find('session', {
            sessionTypeId: Mongodb.ObjectId(sessionTypeId)
          }) : []

        return generateLinks(sessions, inputVersion)
      }
    },
    paths: {
      type: new GraphQLList(PathType),
      args: {
        sessionTypeId: { type: new GraphQLNonNull(GraphQLString) },
        inputVersion: { type: InputVersionType }
      },
      resolve: async (root, { sessionTypeId, inputVersion }) => {
        const sessions = validateId(sessionTypeId)
          ? await Collections.find('session', {
            sessionTypeId: Mongodb.ObjectId(sessionTypeId)
          }) : []

        return generatePaths(sessions, inputVersion)
      }
    },
  })
})

export default QueryRootType
