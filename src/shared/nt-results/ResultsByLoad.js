import _ from 'lodash'

export const generatePaths = (sessions = []) => sessions.map(session => {
  return _.compact(session.actions.map(action => action._id))
})
