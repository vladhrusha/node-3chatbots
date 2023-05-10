const logger = require("./logger");

const getCollection = async () => {
  const dbo = require("../db/conn");
  try {
    await dbo.connectToServer();
    logger.info("Successfully connected to MongoDB.");
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
  try {
    const db = dbo.getDb();
    const subsCollection = await db.collection("subs");
    logger.info("Successfully received collection");
    return subsCollection;
  } catch (err) {
    logger.error("Error receiving collection", err);
    process.exit(1);
  }
};
module.exports = getCollection;
