const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");
// const logger = require("../utils/logger");

const deleteSubscription = async (msg, hour, minute) => {
  const result = await Subscription.deleteMany({
    userName: msg.from.username,
    hour,
    minute,
  });
  if (result.deletedCount === 0) {
    throw new Error("there is nothing to delete");
  }
};

module.exports = deleteSubscription;
