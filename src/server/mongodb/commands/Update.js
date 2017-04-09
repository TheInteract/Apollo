const FindItems = db => async (collectionName, query, update) =>
  db.collection(collectionName).update(query, update)

export default FindItems
