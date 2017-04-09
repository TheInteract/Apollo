/* eslint-disable no-console */

import { createServer } from 'http'
import path from 'path'

import bodyParser from 'body-parser'
import chalk from 'chalk'
import config from 'config'
import express from 'express'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import routers from './routers'
import schema from './schema'
import config from 'config'
import subscriptionManager from './subscriptions/subscriptionManager'

const app = express()

app.use(express.static(path.join(process.cwd(), 'static')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use('/graphql', graphqlExpress((req, res) => ({ schema })))

app.use(routers)

app.listen(config.server.apiPort, err => {
  const serverName = chalk.bgBlue.bold(' GraphQL Server ')
  const url = chalk.yellow(`${config.server.apiHost}:${config.server.apiPort}`)

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
