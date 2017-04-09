import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import _ from 'lodash'
import Mongodb from 'mongodb'

import * as Collections from '../../mongodb/Collections'

export async function resolveCount ({ _id, productId }) {
  const result = await Collections.aggregate('version', [ { $match: {
    featureId: Mongodb.ObjectId(_id),
    productId: Mongodb.ObjectId(productId),
  } }, { $group: { _id: '$name', count: { $sum: 1 } } } ])

  return {
    A: (_.find(result, [ '_id', 'A' ]) || { count: 0 }).count,
    B: (_.find(result, [ '_id', 'B' ]) || { count: 0 }).count,
  }
}

const ProportionType = new GraphQLObjectType({
  name: 'Proportion',
  fields: () => ({
    A: { type: GraphQLInt },
    B: { type: GraphQLInt },
  })
})

const FeatureType = new GraphQLObjectType({
  name: 'Feature',
  description: 'Feature',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    proportion: {
      type: ProportionType,
      resolve: (_) => _.proportion
    },
    count: {
      type: ProportionType,
      resolve: resolveCount
    },
    active: { type: GraphQLBoolean },
  })
})

export default FeatureType
