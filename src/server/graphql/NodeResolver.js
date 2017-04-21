import _ from 'lodash'

import removeFocusAndBlur from './removeFocusAndBlur'

export const generateNodes = (sessions = []) => _.flow([
  sessions => _.map(sessions, removeFocusAndBlur),
  nodes => _.flattenDeep(nodes),
  nodes => _.groupBy(nodes, node => node.actionTypeId),
  nodes => _.map(Object.keys(nodes), nodeId => ({
    _id: nodeId,
    count: nodes[nodeId].length,
    ...nodes[nodeId][0],
  }))
])(sessions)
