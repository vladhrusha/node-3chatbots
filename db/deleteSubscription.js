const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");
// const logger = require("../utils/logger");

const deleteSubscription = async (msg, hour, minute) => {
  const result = await Subscription.updateOne(
    { userName: msg.from.username },
    { $pull: { times: { hour, minute } } },
  );
  if (result.modifiedCount === 0) {
    throw new Error("there is nothing to delete");
  }
};

module.exports = deleteSubscription;
