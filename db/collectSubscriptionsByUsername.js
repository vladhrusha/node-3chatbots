const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");
const logger = require("../utils/logger");

const collectSubscriptionsByUsername = async (username) => {
  try {
    const subscriptions = await Subscription.find({ userName: username });
    return subscriptions;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = collectSubscriptionsByUsername;
