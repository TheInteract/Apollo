const FindItems = db => async (collectionName, query, sortOrder) => {
  const result = await db.collection(collectionName).find(query).sort(sortOrder)
  return result.toArray()
}

export default FindItems
