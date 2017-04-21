const removeInteractClick = target => {
  if (!target) return target
  return target.replace('[interact-click="', '').replace('"]', '')
}

export default removeInteractClick
