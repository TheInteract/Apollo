module.exports = {
  development: {
    host: 'localhost',
    apiHost: 'localhost',
    port: 3000,
    wdsPort: 3001,
    apiPort: 3002,
    wsPort: 8080,
  },
  production: {
    host: 'localhost',
    apiHost: 'localhost',
    port: process.env.PORT || 3000,
    wdsPort: 3001,
    apiPort: 3002,
    wsPort: 8080,
  },
}[ process.env.NODE_ENV || 'development' ]
