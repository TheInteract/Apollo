/* eslint-disable no-console */

import path from 'path'

import bodyParser from 'body-parser'
import chalk from 'chalk'
import express from 'express'
import proxy from 'http-proxy-middleware'

import config from '../shared/configs'
import handleRender from './middlewares/handleRender'

const app = express()

app.use(express.static(path.join(process.cwd(), 'static')))

app.use('/graphiql', proxy({ target: 'http://localhost:3002/graphiql' }))
app.use('/graphql', proxy({ target: 'http://localhost:3002/graphql' }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(handleRender)

app.listen(config.port, err => {
  const serverName = chalk.bgBlue.bold(' SSR Server ')
  const url = chalk.yellow(`${config.host}:${config.port}`)

  console.log()
  console.log(err || `${serverName} listening on ${url}`)
  console.log()
})
