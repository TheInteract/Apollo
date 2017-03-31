const FindOne = db => async (collectionName, query) =>
  await db.collection(collectionName).findOne(query)

export default FindOne
