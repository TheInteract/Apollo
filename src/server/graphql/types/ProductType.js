import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Product',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    API_KEY_PRIVATE: { type: new GraphQLNonNull(GraphQLString) },
    API_KEY_PUBLIC: { type: new GraphQLNonNull(GraphQLString) },
    domainName: { type: new GraphQLNonNull(GraphQLString) },
  })
})

export default ProductType
