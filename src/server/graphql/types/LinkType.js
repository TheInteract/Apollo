import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const LinkType = new GraphQLObjectType({
  name: 'Link',
  description: 'Link type',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    source: { type: new GraphQLNonNull(GraphQLString) },
    target: { type: new GraphQLNonNull(GraphQLString) },
    count: { type: new GraphQLNonNull(GraphQLInt) },
    v: { type: GraphQLString }
  })
})

export default LinkType
