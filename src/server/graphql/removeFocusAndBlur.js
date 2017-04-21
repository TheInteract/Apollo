import _ from 'lodash'

const removeFocusAndBlur = ({ actions }) => _.filter(actions, action => (
  action.type !== 'focus' && action.type !== 'blur'
))

export default removeFocusAndBlur
