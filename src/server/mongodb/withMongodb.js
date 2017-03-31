import url from 'url'

import Promise from 'bluebird'
import { MongoClient } from 'mongodb'

export const connectDB = () => {
  const URL = url.format({
    slashes: true,
    protocol: 'mongodb',
    hostname: 'localhost',
    port: 27017,
    pathname: 'Interact',
    // Note: mongo.auth FORMAT => String admin:pwd
    auth: undefined,
  })
  return MongoClient.connect(URL, { promiseLibrary: Promise })
}

export default fn => async (...params) => {
  void params
  const db = await connectDB()
  const result = await fn(db)(...params)
  db.close.bind(db)()
  return result
}
