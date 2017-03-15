import path from 'path'

import webpack from 'webpack'

import config from './src/shared/configs'

export default {
  devtool: 'eval',

  entry: [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?path=http://${config.host}:${config.wdsPort}/__webpack_hmr&timeout=20000`,
    path.join(__dirname, 'src/client/client.dev.js'),
  ],

  output: {
    path: path.join(__dirname, 'static', 'build'),
    publicPath: `http://${config.host}:${config.wdsPort}/build/`,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [ 'es2015', { modules: false } ],
            'react',
            'stage-2',
          ],
          plugins: [
            'react-hot-loader/babel'
          ],
          cacheDirectory: true
        }
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true),
      },
    }),
  ],
}
