import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import Mongodb from 'mongodb'

import * as Collections from '../mongodb/Collections'
import { FeatureType, ProductType } from './types'

const QueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    product: {
      type: ProductType,
      args: { _id: { type: GraphQLString } },
      resolve: async (_, { _id }) => {
        if (_id.match(/^[0-9a-fA-F]{24}$/)) {
          return null
        }
        const result = Collections.findOne('product', { _id: Mongodb.ObjectId(_id) })
        console.log(`result`, result)
        if (!result) {
          throw Error('Product ID not found')
        }
        return result
      }
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
      resolve: async (_, { _id }) => {
        return _id.match(/^[0-9a-fA-F]{24}$/)
          ? Collections.findOne('feature', {
            _id: Mongodb.ObjectId(_id)
          }) : null
      }
    },
    features: {
      type: new GraphQLList(FeatureType),
      args: { productId: { type: GraphQLString } },
      resolve: async (_, { productId }) => {
        return productId.match(/^[0-9a-fA-F]{24}$/)
          ? Collections.find('feature', {
            productId: Mongodb.ObjectId(productId)
          }, { _id: -1 }) : []
      }
    }
  })
})

export default QueryRootType
