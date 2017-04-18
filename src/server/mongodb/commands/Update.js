const UpdateItem = db => async (collectionName, query, update) =>
  db.collection(collectionName).findOneAndUpdate(query, update, {
    returnOriginal: false
  })

export default UpdateItem
