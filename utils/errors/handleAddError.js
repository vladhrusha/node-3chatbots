const logger = require("../logger");

const handleAddError = async (err, bot, chatId) => {
  if (err.message === "subscription at this time already exists") {
    await bot.sendMessage(
      chatId,
      "You already have a subscription at this timeslot",
    );
  } else if (
    err.message ===
    "Cannot read properties of undefined (reading 'coordinates')"
  ) {
    await bot.sendMessage(chatId, "provide your geolocation using /location");
  } else {
    await bot.sendMessage(chatId, "unable to add, server error");
    logger.info(err);
  }
};

module.exports = handleAddError;
