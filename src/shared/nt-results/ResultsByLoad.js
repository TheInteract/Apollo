import _ from 'lodash'

export const MIN_WIDTH = 900
export const MIN_HEIGHT = 600

const GAP = 80

export const mapActionsToNodes = session => session.actions.map(action => {
  const node = { id: action.actionTypeId, type: action.type }
  return action.type === 'load' ? { ...node, fx: 100, fy: MIN_HEIGHT / 2 } : node
})

export const mapActionsToLinks = session => {
  const actions = session.actions
  const links = []

  if (actions.length > 1) {
    for (let i = 0; i < actions.length - 1; i++) {
      actions[i].type === 'focus' && console.log('focus')
      actions[i].type === 'blur' && console.log('blur')
      links.push({
        source: actions[i].actionTypeId,
        target: actions[i + 1].actionTypeId
      })
    }
  }
  return links
}

export const generateSortedNodes = (nodes, links) => _.flow([
  links => _.groupBy(links, link => link.target),
  sources => _.map(nodes, node => ({
    ...node,
    count: (sources[node.id] || []).length
  })),
  nodes => _.sortBy(nodes, node => node.count),
  nodes => _.map(nodes, (node, index) => ({
    ...node,
    fx: index * GAP + GAP,
    fy: index * GAP + GAP,
  }))
])(links)

export const generateNodes = (sessions = []) => _.flow([
  sessions => _.map(sessions, mapActionsToNodes),
  nodes => _.flattenDeep(nodes),
  nodes => _.filter(nodes, node => node.type !== 'focus' && node.type !== 'blur'),
  nodes => _.groupBy(nodes, node => node.id),
  nodes => _.map(Object.keys(nodes), nodeId => ({
    id: nodeId,
    count: nodes[nodeId].length,
    ...nodes[nodeId][0],
  }))
])(sessions)

export const generateLinks = (sessions = []) => _.flow([
  sessions => _.map(sessions, session => ({
    ...session,
    actions: _.filter(session.actions, action => (
      action.type !== 'focus' && action.type !== 'blur'
    ))
  })),
  sessions => _.map(sessions, mapActionsToLinks),
  links => _.flattenDeep(links),
  links => _.uniqWith(links, _.isEqual)
])(sessions)

export const generatePaths = (sessions = []) => sessions.map(session => {
  return _.compact(session.actions.map(action => action.actionTypeId))
})
