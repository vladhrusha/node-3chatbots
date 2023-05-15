const Subscription = require("../models/Subscription");
// eslint-disable-next-line
const mongoose = require("../db/index");
const logger = require("../utils/logger");

const updateLocation = async (username, lat, lon) => {
  try {
    await Subscription.updateOne(
      { userName: username },
      { $set: { "coordinates.lat": lat, "coordinates.lon": lon } },
    );
  } catch (err) {
    logger.error(err);
  }
};

const deleteSubscription = async (msg, hour, minute) => {
  try {
    const result = await Subscription.updateOne(
      { userName: msg.from.username },
      { $pull: { times: { hour, minute } } },
    );
    if (result.modifiedCount === 0) {
      throw new Error("there is nothing to delete");
    }
  } catch (err) {
    logger.error(err);
  }
};

const getByUsername = async (username) => {
  try {
    return await Subscription.findOne({ userName: username });
  } catch (err) {
    logger.error(err);
  }
};

const getAllSubscriptions = async () => {
  try {
    return await Subscription.find();
  } catch (err) {
    logger.error(err);
  }
};

const addSubscription = async (msg, hour, minute, userData) => {
  try {
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
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  updateLocation,
  deleteSubscription,
  getByUsername,
  getAllSubscriptions,
  addSubscription,
};
