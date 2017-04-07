import { GraphQLSchema } from 'graphql'

import MutationRootType from './MutationRootType'
import QueryRootType from './QueryRootType'
import SubscriptionRootType from './SubscriptionRootType'

const Schema = new GraphQLSchema({
  query: QueryRootType,
  mutation: MutationRootType,
  subscription: SubscriptionRootType,
})

export default Schema
