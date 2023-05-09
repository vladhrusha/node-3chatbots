const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
// const logger = require("../utils/logger");
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;
module.exports = {
  connectToServer: async function () {
    const db = await client.connect();
    if (db) {
      _db = await db.db("subs");
    }
  },
  getDb: function () {
    return _db;
  },
};
