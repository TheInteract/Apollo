/* eslint-disable no-console */

import { createServer } from 'http'
import path from 'path'

import bodyParser from 'body-parser'
import chalk from 'chalk'
import express from 'express'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import config from '../shared/configs'
import schema from './schema'
import { subscriptionManager } from './subscriptions'

const app = express()

app.use(express.static(path.join(process.cwd(), 'static')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use('/graphql', graphqlExpress((req, res) => ({ schema })))

app.listen(config.apiPort, err => {
  const serverName = chalk.bgYellow.bold(' GraphQL Server ')
  const url = chalk.yellow(`${config.apiHost}:${config.apiPort}`)

  console.log()
  console.log(err || `${serverName} listening on ${url}`)
  console.log()
})

const webSocketServer = createServer((req, res) => {
  res.writeHead(404)
  res.end()
})

webSocketServer.listen(config.wsPort, () => {
  const serverName = chalk.bgYellow.bold(' Websocket Server ')
  const url = chalk.yellow(`http://localhost:${config.wsPort}`)

  console.log()
  console.log(`${serverName} is now running on ${url}`)
  console.log()
})

void new SubscriptionServer(
  { subscriptionManager },
  { server: webSocketServer }
)
