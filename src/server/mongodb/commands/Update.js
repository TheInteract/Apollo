const FindItems = db => async (collectionName, query, update) =>
  await db.collection(collectionName).update(query, update)

export default FindItems
