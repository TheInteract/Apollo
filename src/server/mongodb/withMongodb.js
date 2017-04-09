import url from 'url'

import Promise from 'bluebird'
import config from 'config'
import { MongoClient } from 'mongodb'

export const connectDB = () => {
  const URL = url.format({
    slashes: true,
    protocol: config.mongo.protocol,
    hostname: config.mongo.host,
    port: config.mongo.port,
    pathname: config.mongo.db,
    // Note: mongo.auth FORMAT => String admin:pwd
    auth: undefined,
  })
  return MongoClient.connect(URL, { promiseLibrary: Promise })
}

export default fn => async (...params) => {
  // HACK: void params is needed here since without it params has no value when
  // passing to the fn. This might be a bug because in Artemis project it works
  // fine. Anyway, I'm not sure which environment cause this bug
  // (babel or node 7.6 or something else)
  void params
  const db = await connectDB()
  const result = await fn(db)(...params)
  db.close.bind(db)()
  return result
}
