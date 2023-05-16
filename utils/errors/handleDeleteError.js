const logger = require("../logger");

const handleDeleteError = async (err, bot, chatId) => {
  if (err.message === "there is nothing to delete") {
    await bot.sendMessage(chatId, "there is nothing to delete");
  } else {
    await bot.sendMessage(chatId, "unable to delete, server error");
    logger.info(err);
  }
};

module.exports = handleDeleteError;
