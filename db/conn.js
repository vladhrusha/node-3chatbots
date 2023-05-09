const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const logger = require("../utils/logger");
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;
module.exports = {
  connectToServer: async function (callback) {
    try {
      const db = await client.connect();
      // const adminDb = await client.db().admin();
      if (db) {
        _db = await db.db("subs");
        logger.info("Successfully connected to MongoDB.");
        // console.log(_db);
        if (typeof callback === "function") {
          callback(null);
        }
      }
    } catch (err) {
      logger.error(err);
      if (typeof callback === "function") {
        callback(err);
      }
    }
  },
  getDb: function () {
    return _db;
  },
};
