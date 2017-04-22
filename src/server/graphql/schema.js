import { GraphQLSchema } from 'graphql'

import MutationRootType from './MutationRootType'
import QueryRootType from './QueryRootType'

const schema = new GraphQLSchema({
  query: QueryRootType,
  mutation: MutationRootType,
})

export default schema
