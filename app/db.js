const { MongoClient } = require("mongodb");
const MONGODB_URI = "mongodb://mongohost";
const DB_NAME = "sant_mongo";
let cachedDB;

module.exports = {
  connect2db: async () => {
    if (cachedDB) {
      return cachedDB;
    }
    try {
      console.log("Aquiring new DB connection...");
      const client = await MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true });
      cachedDB = client.db(DB_NAME);
      await cachedDB.collection("users").createIndex({ username: "text" });
      await cachedDB.collection("auctions").createIndex(
        { title: "text", description: "text" }
      );
      return cachedDB;
    } catch (error) {
      console.log("ERROR aquiring DB Connection!");
      return null;
    }
  }
};