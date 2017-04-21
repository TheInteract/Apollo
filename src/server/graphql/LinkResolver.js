import _ from 'lodash'

import removeFocusAndBlur from './removeFocusAndBlur'

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
  links => _.map(Object.keys(links), linkId => ({
    count: links[linkId].length,
    ...links[linkId][0],
  })),
])(sessions)
