import _ from 'lodash'

const removeFocusAndBlur = ({ actions }) => _.filter(actions, action => (
  action.type !== 'focus' && action.type !== 'blur'
))

export const removeInteractClick = target => {
  if (!target) return target
  return target.replace('[interact-click="', '').replace('"]', '')
}

export const generateNodes = (sessions = []) => _.flow([
  sessions => _.map(sessions, removeFocusAndBlur),
  nodes => _.flattenDeep(nodes),
  nodes => _.groupBy(nodes, node => node.actionTypeId),
  nodes => _.map(Object.keys(nodes), nodeKey => ({
    ...nodes[nodeKey][0],
    count: nodes[nodeKey].length,
  }))
])(sessions)

export const mapActionsToLinks = session => {
  const actions = removeFocusAndBlur(session)
  const links = []

  if (actions.length > 1) {
    for (let i = 0; i < actions.length - 1; i++) {
      links.push({
        source: actions[i].actionTypeId,
        target: actions[i + 1].actionTypeId
      })
    }
  }

  return links
}

export const generateLinks = (sessions = []) => _.flow([
  sessions => _.map(sessions, mapActionsToLinks),
  links => _.flattenDeep(links),
  links => _.groupBy(links, link => link.source + link.target),
  links => _.map(Object.keys(links), linkKey => ({
    ...links[linkKey][0],
    count: links[linkKey].length,
  })),
])(sessions)

export const generatePaths = (sessions = []) => _.flow([
  sessions => _.map(sessions, session => ({
    ...session,
    actions: _.filter(session.actions, action => (
      action.type !== 'focus' && action.type !== 'blur'
    ))
  })),
  paths => _.groupBy(paths, path => (
    _.reduce(path.actions, (prev, action) => prev + action.actionTypeId, '')
  )),
  paths => _.map(Object.keys(paths), pathKey => ({
    ...paths[pathKey][0],
    count: paths[pathKey].length,
  })),
])(sessions)
