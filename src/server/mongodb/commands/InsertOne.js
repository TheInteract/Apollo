const InsertItem = db => async (collectionName, query) =>
  (await db.collection(collectionName).insertOne(query)).ops[0]

export default InsertItem
