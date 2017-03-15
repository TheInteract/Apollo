/* eslint-disable no-console */

import path from 'path'

import chalk from 'chalk'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from '../../webpack.config.dev.babel.js'
import config from '../shared/configs'

const app = express()

const compiler = webpack(webpackConfig)

app.use(express.static(path.join(process.cwd(), 'static')))

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  path: '/__webpack_hmr',
  publicPath: webpackConfig.output.publicPath,
}))
app.use(webpackHotMiddleware(compiler))

app.listen(config.wdsPort, err => {
  console.log()
  console.log(err || `${chalk.bgYellow.bold(' HMR Server ')} listening on ${chalk.yellow(`${config.host}:${config.wdsPort}`)}`)
  console.log()
})
