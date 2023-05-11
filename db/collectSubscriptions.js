const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");
const logger = require("../utils/logger");

const collectSubscriptions = async () => {
  try {
    const subscriptions = await Subscription.find();
    return subscriptions;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = collectSubscriptions;
