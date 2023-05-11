const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");
// const logger = require("../utils/logger");

const addSubscription = async (msg, hour, minute, userData) => {
  const existingSubscription = await Subscription.findOne({
    userId: msg.from.id,
    userName: msg.from.username,
    chatId: msg.chat.id,
  });

  if (existingSubscription) {
    const existingTime = existingSubscription.times.find(
      (time) => time.hour === hour && time.minute === minute,
    );
    if (existingTime) {
      throw new Error("subscription at this time already exists");
    }
    existingSubscription.times.push({ hour, minute });
    await existingSubscription.save();
  } else {
    const newSubscription = new Subscription({
      userId: msg.from.id,
      userName: msg.from.username,
      times: [{ hour, minute }],
      chatId: msg.chat.id,
      coordinates: {
        lat: userData.coordinates.lat,
        lon: userData.coordinates.lon,
      },
    });
    await newSubscription.save();
  }
};

module.exports = addSubscription;
