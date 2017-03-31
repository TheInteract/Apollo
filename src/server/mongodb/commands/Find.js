const FindItems = db => async (collectionName, query) => {
  const result = await db.collection(collectionName).find(query)
  return result.toArray()
}

export default FindItems
