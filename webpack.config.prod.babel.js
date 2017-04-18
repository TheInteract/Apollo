import path from 'path'

import AssetsPlugin from 'assets-webpack-plugin'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

export default {
  bail: true,
  entry: [
    path.join(__dirname, 'src/shared/nt-styles/base.styl'),
    path.join(__dirname, 'src/client/client.prod.js'),
  ],

  output: {
    path: path.join(__dirname, 'static', 'build'),
    publicPath: '/build/',
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|\.git/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [ 'es2015', { modules: false } ],
            'react',
            'stage-2',
          ],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                minimize: true,
              },
            },
            'postcss-loader',
            {
              loader: 'stylus-loader',
              options: {
                includePaths: [ path.join(__dirname, 'src/shared/styles') ]
              }
            },
          ],
        }),
      },
    ],
  },

  resolve: {
    extensions: [
      '.json',
      '.js',
    ],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true),
      },
    }),
    new UglifyJSPlugin(),
    new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      allChunks: true,
    }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.join(__dirname, 'static'),
      prettyPrint: true,
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.styl$/,
      options: {
        context: __dirname,
        postcss: [
          autoprefixer({ browsers: [ '> 5%', 'IE > 10', 'last 2 versions' ] })
        ]
      }
    })
  ],
}
