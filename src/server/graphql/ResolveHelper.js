import _ from 'lodash'

const removeFocusAndBlur = actions => _.filter(actions, action => (
  action.type !== 'focus' && action.type !== 'blur'
))

export const removeInteractClick = target => {
  if (!target) return target
  return target.replace('[interact-click="', '').replace('"]', '')
}

const filterByVersion = ({ featureId, name }) => session => (
  !featureId || _.find(session.versions, version => (
    version.featureId.toString() === featureId &&
      version.name === name)
  )
)

const mapSessionToNodes = ({ actions }) => removeFocusAndBlur(actions)

export const generateNodes = (sessions = [], version) => _.flow([
  sessions => _.filter(sessions, filterByVersion(version)),
  sessions => _.map(sessions, mapSessionToNodes),
  nodes => _.flattenDeep(nodes),
  nodes => _.groupBy(nodes, node => node.actionTypeId),
  nodes => _.map(nodes, node => ({
    ...node[0],
    count: node.length,
    v: version.name
  }))
])(sessions)

export const mapActionsToLinks = session => {
  const actions = removeFocusAndBlur(session.actions)
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

export const generateLinks = (sessions = [], version) => _.flow([
  sessions => _.filter(sessions, filterByVersion(version)),
  sessions => _.map(sessions, mapActionsToLinks),
  links => _.flattenDeep(links),
  links => _.groupBy(links, link => link.source + ', ' + link.target),
  links => _.map(links, (link, key) => ({
    ...link[0],
    _id: key,
    count: link.length,
    v: version.name
  })),
])(sessions)

const mapSessionsToPaths = session => ({
  ...session,
  actions: removeFocusAndBlur(session.actions)
})

const reduceActionTypeIds = path => (
  _.reduce(path.actions, (ids, action) => ids + action.actionTypeId, '')
)

export const generatePaths = (sessions = [], version) => _.flow([
  sessions => _.filter(sessions, filterByVersion(version)),
  sessions => _.map(sessions, mapSessionsToPaths),
  paths => _.groupBy(paths, reduceActionTypeIds),
  paths => _.map(paths, path => ({ ...path[0], count: path.length })),
])(sessions)
