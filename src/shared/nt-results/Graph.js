export const angleToPoints = (angle) => {
  const segment = Math.floor(angle / Math.PI * 2) + 2
  const diagonal = (1 / 2 * segment + 1 / 4) * Math.PI
  const op = Math.cos(Math.abs(diagonal - angle)) * Math.sqrt(2)
  const x = op * Math.cos(angle)
  const y = op * Math.sin(angle)

  return {
    x1: x < 0 ? 1 : 0,
    y1: y < 0 ? 1 : 0,
    x2: x >= 0 ? x : x + 1,
    y2: y >= 0 ? y : y + 1
  }
}
