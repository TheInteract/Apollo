import styles from './MainLayout.styl'

import React from 'react'

class MainLayout extends React.Component {
  render () {
    return (
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          Sidebar
        </div>
        <div className={styles.content}>
          Content Hello kk
        </div>
      </div>
    )
  }
}

export default MainLayout
