if (process.env.NODE_ENV === 'production') {
  process.env.webpackAssets = JSON.stringify(require('./static/assets.json'))
}

require('babel-register')({
  plugins: [
    [
      'css-modules-transform', {
        preprocessCss: 'css-modules-stylus',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        extensions: [ '.styl' ],
      },
    ],
  ],
})
require('./src/server/ssr-server')
