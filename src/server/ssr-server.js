/* eslint-disable no-console */

import path from 'path'

import bodyParser from 'body-parser'
import chalk from 'chalk'
import config from 'config'
import express from 'express'
import proxy from 'http-proxy-middleware'

import handleRender from './middlewares/handleRender'
import healthzRouter from './middlewares/healthzRouter'

const app = express()

app.use(express.static(path.join(process.cwd(), 'static')))

app.use(healthzRouter)

app.use(proxy('/graphiql', {
  target: `http://${config.api.host}:${config.api.port}/graphiql`
}))

app.use(proxy('/graphql', {
  target: `http://${config.api.host}:${config.api.port}/graphql`
}))

app.use(proxy('/ws', { target: `ws://${config.ws.host}:${config.ws.port}`, ws: true }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(handleRender)

app.listen(config.ssr.port, err => {
  const serverName = chalk.bgBlue.bold(' SSR Server ')
  const url = chalk.yellow(`${config.ssr.host}:${config.ssr.port}`)

  console.log()
  console.log(err || `${serverName} listening on ${url}`)
  console.log()
})
