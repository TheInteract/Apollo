module.exports = {
  development: {
    host: 'localhost',
    port: 3000,
    wdsPort: 8080,
  },
  production: {
    host: 'localhost',
    port: process.env.PORT || 3000,
    wdsPort: 8080,
  },
}[ process.env.NODE_ENV || 'development' ]
