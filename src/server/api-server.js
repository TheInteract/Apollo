/* eslint-disable no-console */

import path from 'path'

import bodyParser from 'body-parser'
import chalk from 'chalk'
import config from 'config'
import express from 'express'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'

import schema from './schema'

const app = express()

app.use(express.static(path.join(process.cwd(), 'static')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use('/graphql', graphqlExpress((req, res) => ({ schema })))

app.listen(config.server.apiPort, err => {
  const serverName = chalk.bgBlue.bold(' GraphQL Server ')
  const url = chalk.yellow(`${config.server.apiHost}:${config.server.apiPort}`)

  console.log()
  console.log(err || `${serverName} listening on ${url}`)
  console.log()
})
