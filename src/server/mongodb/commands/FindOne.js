const FindOne = db => async (collectionName, query) =>
  db.collection(collectionName).findOne(query)

export default FindOne
