const logger = require("./logger");
const onGetUserLocation = require("./onGetUserLocation");
const { requestLocation, respondLocation } = require("./messages");
const handleStart = async (chatId, bot, userData) => {
  try {
    await requestLocation(bot, chatId);
  } catch (err) {
    logger.error(err);
  }
  userData = await onGetUserLocation(bot);
  try {
    await respondLocation(bot, chatId);
  } catch (err) {
    logger.error(err);
  }
  return userData;
};

module.exports = handleStart;
