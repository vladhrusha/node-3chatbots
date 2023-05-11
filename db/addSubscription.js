const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");
// const logger = require("../utils/logger");

const addSubscription = async (msg, hour, minute, userData) => {
  let subscription;
  if (hour !== undefined && minute !== undefined) {
    subscription = new Subscription({
      userId: msg.from.id,
      userName: msg.from.username,
      hour,
      minute,
      chatId: msg.chat.id,
    });
  }
  if (subscription === undefined) {
    return;
  }
  subscription.coordinates = {
    lat: userData.coordinates.lat,
    lon: userData.coordinates.lon,
  };
  if (Object.keys(subscription.toJSON()).length !== 0) {
    const foundSubscription = await Subscription.findOne({
      hour: subscription.hour,
      minute: subscription.minute,
      userName: subscription.userName,
    });
    if (foundSubscription) {
      throw new Error("subscription at this time already exists");
    } else {
      await subscription.save();
    }
    Object.keys(subscription).forEach((key) => delete subscription[key]);
  }
};

module.exports = addSubscription;
