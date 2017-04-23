import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const SessionTypeType = new GraphQLObjectType({
  name: 'SessionType',
  description: 'SessionType type',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    url: { type: new GraphQLNonNull(GraphQLString) },
  })
})

export default SessionTypeType
