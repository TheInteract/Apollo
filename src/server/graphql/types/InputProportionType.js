import {
  GraphQLInputObjectType,
  GraphQLInt,
} from 'graphql'

const InputProportionType = new GraphQLInputObjectType({
  name: 'InputProportion',
  fields: () => ({
    A: { type: GraphQLInt, defaultValue: 50 },
    B: { type: GraphQLInt, defaultValue: 50 },
  })
})

export default InputProportionType
