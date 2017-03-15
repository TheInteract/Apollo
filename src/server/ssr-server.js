/* eslint-disable no-console */

import chalk from 'chalk'
import express from 'express'

import config from '../shared/configs'
import handleRender from './handleRender'

const app = express()

app.use(handleRender)

app.listen(config.port, err => {
  console.log()
  console.log(err || `${chalk.bgYellow.bold(' SSR Server ')} listening on ${chalk.yellow(`${config.host}:${config.port}`)}`)
  console.log()
})
