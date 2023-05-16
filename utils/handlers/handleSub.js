const logger = require("../logger");
const { requestTime } = require("../messages");

const handleSub = async (chatId, bot, isSubscribingMap) => {
  try {
    isSubscribingMap.set(chatId, true);
    await requestTime(bot, chatId, isSubscribingMap.get(chatId));
    return isSubscribingMap;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = handleSub;
