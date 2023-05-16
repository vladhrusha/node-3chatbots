const logger = require("../logger");
const { requestTime } = require("../messages");

const handleUnsub = async (chatId, bot, isSubscribingMap, userName) => {
  try {
    isSubscribingMap.set(chatId, false);
    await requestTime(bot, chatId, isSubscribingMap.get(chatId), userName);
    return isSubscribingMap;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = handleUnsub;
