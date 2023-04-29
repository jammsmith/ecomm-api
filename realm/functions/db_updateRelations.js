exports = async function (
  documentId,
  collectionType,
  targetCollectionId,
  arrayKey,
  isNewItem
) {
  // Make sure collection type is lowercase
  const lowerCaseCollectionType = collectionType.toLowerCase();

  const dbName = context.values.get('DATABASE_NAME');
  const collection = context.services
    .get('mongodb-atlas')
    .db(dbName)
    .collection(lowerCaseCollectionType);

  try {
    const result = {
      addedToTarget: false,
      removedFromExisting: false
    };

    // Add to target array
    try {
      console.log('targetCollectionId', targetCollectionId);
      const query = { _id: targetCollectionId };

      const targetDocument = await collection.findOne(query);
      console.log('targetDocument.name', targetDocument.name);

      const updatedTargetDocumentRelations = targetDocument[arrayKey]
        ? [...targetDocument[arrayKey], documentId]
        : [documentId];
      console.log('updatedTargetDocumentRelations', updatedTargetDocumentRelations);

      await collection.findOneAndUpdate(
        query,
        {
          $set: { [arrayKey]: updatedTargetDocumentRelations }
        },
        { returnNewDocument: true }
      );

      result.addedToTarget = true;
    } catch {
      console.log('Failed to add to target array');
    }

    // Remove from existing array if its an update rather than a new creation
    if (!isNewItem && result.addedToTarget) {
      try {
        const query = {
          $and: [
            { [arrayKey]: { $in: [documentId] } },
            { _id: { $ne: targetCollectionId } }
          ]
        };

        const existingCollection = await collection.findOne(query);
        console.log('existingCollection.name', existingCollection.name);

        const updatedArray = existingCollection[arrayKey].filter(item => item !== documentId);
        console.log('updatedArray', updatedArray);

        await collection.findOneAndUpdate(
          query,
          {
            $set: { [arrayKey]: updatedArray }
          },
          { returnNewDocument: true }
        );

        result.removedFromExisting = true;
      } catch {
        console.log('Failed to remove from existing array');
      }
    }

    return result;
  } catch (err) {
    console.log(err);
  }
};
