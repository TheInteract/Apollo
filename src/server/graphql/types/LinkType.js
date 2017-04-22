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
    source: { type: new GraphQLNonNull(GraphQLString) },
    target: { type: new GraphQLNonNull(GraphQLString) },
    count: { type: new GraphQLNonNull(GraphQLInt) },
  })
})

export default LinkType
