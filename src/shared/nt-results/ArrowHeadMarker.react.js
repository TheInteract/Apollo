import React from 'react'

import styles from './ArrowHeadMarker.styl'

export const WIDTH = 2
export const HEIGHT = 3

class ArrowHeadMarker extends React.Component {
  render () {
    return (
      <marker
        id='arrowHead'
        viewBox={`0 ${-(HEIGHT / 2)} ${WIDTH} ${HEIGHT}`}
        orient='auto'
        markerWidth={WIDTH}
        markerHeight={HEIGHT}
      >
        <path
          className={styles.nt}
          d={`M 0,${-(HEIGHT / 2)} L ${WIDTH},0 L 0,${HEIGHT / 2}`}
        />
      </marker>
    )
  }
}

export default ArrowHeadMarker
