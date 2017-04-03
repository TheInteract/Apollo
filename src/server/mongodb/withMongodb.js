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
  // HACK: void params is needed here since without it params has no value when
  // passing to the fn. This might be a bug because in Artemis project it works
  // fine, but anyway I'm not sure which environment cause this bug
  // (babel or node 7.6 or something else)
  void params
  const db = await connectDB()
  const result = await fn(db)(...params)
  db.close.bind(db)()
  return result
}
