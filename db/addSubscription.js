const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");
const logger = require("../utils/logger");

const addSubscription = async (bot, msg, hour, minute, userData) => {
  let subscription;
  if (hour !== undefined && minute !== undefined) {
    subscription = new Subscription({
      userId: msg.from.id,
      userName: msg.from.username,
      hour,
      minute,
    });
  }
  try {
    if (subscription === undefined) {
      return;
    }
    subscription.coordinates = {
      lat: userData.coordinates.lat,
      lon: userData.coordinates.lon,
    };
    if (Object.keys(subscription.toJSON()).length !== 0) {
      try {
        await subscription.save();
        bot.sendMessage(
          msg.chat.id,
          `You have subscribed on weather daily report at ${subscription.hour}:${subscription.minute}`,
        );
      } catch (err) {
        logger.error(err);
      }
      Object.keys(subscription).forEach((key) => delete subscription[key]);
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = addSubscription;
