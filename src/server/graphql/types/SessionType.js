import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import _ from 'lodash'

const removeInteractClick = target => {
  if (!target) return target
  return target.replace('[interact-click="', '').replace('"]', '')
}

const ActionType = new GraphQLObjectType({
  name: 'Action',
  fields: () => ({
    type: { type: new GraphQLNonNull(GraphQLString) },
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: _ => _.actionTypeId || 'null'
    },
    data: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: _ => _.url || removeInteractClick(_.target) || _.endpoint
    }
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
    actions: {
      type: new GraphQLList(ActionType),
      resolve: ({ actions }) => {
        return _.filter(actions, action => (
          action.type !== 'focus' && action.type !== 'blur'
        ))
      }
    },
  })
})

export default SessionType
