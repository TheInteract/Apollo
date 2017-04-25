import className from 'classnames'
import React from 'react'

import styles from './HomePage.styl'

export default () => (
  <div className={styles.nt}>
    <div className={className(styles.nt__title, styles.nt__right)}>
      Interact
      <div className={styles.nt__subtitle}>
        today
      </div>
    </div>
  </div>
)
