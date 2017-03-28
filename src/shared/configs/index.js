module.exports = {
  development: {
    host: 'localhost',
    apiHost: 'localhost',
    port: 3000,
    wdsPort: 8080,
    apiPort: 3002,
  },
  production: {
    host: 'localhost',
    apiHost: 'localhost',
    port: process.env.PORT || 3000,
    wdsPort: 8080,
    apiPort: 3002,
  },
}[ process.env.NODE_ENV || 'development' ]
