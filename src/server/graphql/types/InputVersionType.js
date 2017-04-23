import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

const InputVersionType = new GraphQLInputObjectType({
  name: 'InputVersion',
  fields: () => ({
    featureId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  })
})

export default InputVersionType
