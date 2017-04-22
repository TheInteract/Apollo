import _ from 'lodash'

export const removeFocusAndBlur = ({ actions }) => _.filter(actions, action => (
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
  nodes => _.map(nodes, node => ({ ...node[0], count: node.length }))
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
  links => _.map(links, link => ({ ...link[0], count: link.length })),
])(sessions)

const mapSessionsToPaths = session => ({
  ...session,
  actions: removeFocusAndBlur(session)
})

const reduceActionTypeIds = path => (
  _.reduce(path.actions, (ids, action) => ids + action.actionTypeId, '')
)

export const generatePaths = (sessions = []) => _.flow([
  sessions => _.map(sessions, mapSessionsToPaths),
  paths => _.groupBy(paths, reduceActionTypeIds),
  paths => _.map(paths, path => ({ ...path[0], count: path.length })),
])(sessions)
