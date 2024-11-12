async function recommendProducts(db, userId) {
  const usersCollection = db.collection("users");
  const productsCollection = db.collection("products");
  const userHistoryCollection = db.collection("userHistory");

  // Get user preferences
  const user = await usersCollection.findOne({ _id: userId });
  if (!user) throw new Error("User not found");

  // Get user's viewing history
  const userHistory = await userHistoryCollection.findOne({ userId });
  const viewedProductIds = userHistory ? userHistory.viewedProducts : [];

  // Recommendation based on user preferences
  const preferredProducts = await productsCollection
    .find({ tags: { $in: user.preferences } })
    .limit(10)
    .toArray();

  // Recommendation based on viewing history, excluding already viewed products
  const historyBasedRecommendations = await productsCollection
    .find({
      _id: { $nin: viewedProductIds },
      tags: { $in: user.preferences },
    })
    .limit(10)
    .toArray();

  return { preferredProducts, historyBasedRecommendations };
}

module.exports = { recommendProducts };
