const Count = db => async (collectionName, query) =>
  db.collection(collectionName).count(query)

export default Count
