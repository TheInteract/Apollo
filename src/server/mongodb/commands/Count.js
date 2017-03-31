const Count = db => async (collectionName, query) =>
  await db.collection(collectionName).count(query)

export default Count
