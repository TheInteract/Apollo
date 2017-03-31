import CountCommand from './commands/Count'
import FindCommand from './commands/Find'
import FindOneCommand from './commands/FindOne'
import InsertOneCommand from './commands/InsertOne'
import withMongodb from './withMongodb'

export const findOne = withMongodb(FindOneCommand)
export const find = withMongodb(FindCommand)
export const insertOne = withMongodb(InsertOneCommand)
export const count = withMongodb(CountCommand)
