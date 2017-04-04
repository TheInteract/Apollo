const Count = db => async (collectionName, pipeline) => {
  const result = await db.collection(collectionName).aggregate(pipeline)
  return result.toArray()
}

export default Count
