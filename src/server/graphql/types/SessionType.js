import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const ActionType = new GraphQLObjectType({
  name: 'Action',
  fields: () => ({
    type: {
      type: GraphQLString,
      resolve: _ => _.type === 'focus' || _.type === 'blur' ? 'out' : _.type
    },
    actionTypeId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: _ => {
        const type = _.type === 'focus' || _.type === 'blur' ? 'out' : _.type
        return type + '.' + (_.url || _.target || _.endpoint)
      }
    },
    url: { type: GraphQLString },
    target: { type: GraphQLString },
    endpoint: { type: GraphQLString },
  })
})

const SessionType = new GraphQLObjectType({
  name: 'Session',
  description: 'Action type',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    deviceCode: { type: new GraphQLNonNull(GraphQLString) },
    sessionTypeId: { type: new GraphQLNonNull(GraphQLString) },
    versions: { type: new GraphQLList(GraphQLString) },
    actions: { type: new GraphQLList(ActionType) },
  })
})

export default SessionType
