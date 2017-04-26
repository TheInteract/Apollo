import className from 'classnames'
import React from 'react'

import styles from './HomePage.styl'

export default () => {
  const overLay = 'rgba(255,255,255,0.3)'
  return (
    <div className={styles.nt}>
      <div className={className(styles.nt__title, styles.nt__right)}>
        Interact
        <div className={styles.nt__subtitle}>
          today
        </div>
      <svg className={styles.nt__curve}>
        <defs>
          <linearGradient id='grad' x1='-10%' y1='-50%' x2='100%' y2='50%' gradientTransform='rotate(-81)'>
            <stop offset='7%' style={{ stopColor: 'rgb(231,54,72)', stopOpacity: 1 }} />
            <stop offset='38%' style={{ stopColor: 'rgb(242,102,204)', stopOpacity: 1 }} />
            <stop offset='67%' style={{ stopColor: 'rgb(144,104,237)', stopOpacity: 1 }} />
            <stop offset='100%' style={{ stopColor: 'rgb(97,97,234)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path d={`M0,200
          C200,250 250,300 420,180
          C500,120 650,80 720,320
          C800,600 950,450 1100,350
          C1250,240 1350,320 1400,400
          L1400,0
          L0,0`} fill='url(#grad)' />
        <path d={
          `M0,200 C200,250 250,300 420,180 C420,180 280,300 0,160`
          } fill={overLay} />
        <path d={
          `M420,180 C420,180 650,80 720,320 C720,320 650,-50 420,180`
          } fill={overLay} />
        <path d={
          `M720,320 C720,320 750,550 1100,350 C1100,350 750,700 720,320`
          } fill={overLay} />
        <path d={
          `M1100,350 C1100,350 1300,120 1400,400 C1400,400 1350,250 1100,350`
          } fill={overLay} />
      </svg>
    </div>
  )
}
