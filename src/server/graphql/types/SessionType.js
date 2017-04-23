import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import _ from 'lodash'

import { removeInteractClick } from '../ResolveHelper'

const ActionType = new GraphQLObjectType({
  name: 'Action',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => root.actionTypeId
    },
    type: { type: new GraphQLNonNull(GraphQLString) },
    data: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => root.url || removeInteractClick(root.target) || root.endpoint
    }
  })
})

const SessionType = new GraphQLObjectType({
  name: 'Session',
  description: 'Session type',
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
