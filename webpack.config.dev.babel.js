import path from 'path'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'

import config from './src/shared/configs'

export default {
  devtool: 'eval',

  entry: [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?path=http://${config.host}:${config.wdsPort}/__webpack_hmr&timeout=20000`,
    path.join(__dirname, 'src/shared/nt-styles/base.styl'),
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
        include: path.resolve(__dirname, 'src'),
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
      {
        test: /\.styl$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              module: true,
              sourceMap: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true,
              includePaths: [ path.join(__dirname, 'src/shared/styles') ]
            }
          },
        ],
      }
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
    new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      allChunks: true,
    }),
  ],
}
