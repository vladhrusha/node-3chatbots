const mongoose = require("mongoose");

const Db = process.env.ATLAS_URI;
const logger = require("../utils/logger");

let conn;
try {
  conn = mongoose.connect(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logger.info("connected");
} catch (err) {
  logger.error(err);
}
module.exports = conn;
