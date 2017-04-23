import _ from 'lodash'

const removeFocusAndBlur = actions => _.filter(actions, action => (
  action.type !== 'focus' && action.type !== 'blur'
))

export const removeInteractClick = target => {
  if (!target) return target
  return target.replace('[interact-click="', '').replace('"]', '')
}

const filterByVersion = inputVersion => session => (
  !inputVersion || _.find(session.versions, version => (
    version.featureId.toString() === inputVersion.featureId &&
      version.name === inputVersion.name)
  )
)

const mapSessionToNodes = ({ actions }) => removeFocusAndBlur(actions)

export const generateNodes = (sessions = [], inputVersion) => _.flow([
  sessions => _.filter(sessions, filterByVersion(inputVersion)),
  sessions => _.map(sessions, mapSessionToNodes),
  nodes => _.flattenDeep(nodes),
  nodes => _.groupBy(nodes, node => node.actionTypeId),
  nodes => _.map(nodes, node => ({ ...node[0], count: node.length }))
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

export const generateLinks = (sessions = [], inputVersion) => _.flow([
  sessions => _.filter(sessions, filterByVersion(inputVersion)),
  sessions => _.map(sessions, mapActionsToLinks),
  links => _.flattenDeep(links),
  links => _.groupBy(links, link => link.source + link.target),
  links => _.map(links, link => ({ ...link[0], count: link.length })),
])(sessions)

const mapSessionsToPaths = session => ({
  ...session,
  actions: removeFocusAndBlur(session.actions)
})

const reduceActionTypeIds = path => (
  _.reduce(path.actions, (ids, action) => ids + action.actionTypeId, '')
)

export const generatePaths = (sessions = [], inputVersion) => _.flow([
  sessions => _.filter(sessions, filterByVersion(inputVersion)),
  sessions => _.map(sessions, mapSessionsToPaths),
  paths => _.groupBy(paths, reduceActionTypeIds),
  paths => _.map(paths, path => ({ ...path[0], count: path.length })),
])(sessions)
