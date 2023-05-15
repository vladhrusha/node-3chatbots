const {
  deleteSubscription,
  addSubscription,
} = require("../services/subscription.service");
const handleAddError = require("./errors/handleAddError");
const handleDeleteError = require("./errors/handleDeleteError");
const addCronJob = require("./addCronJob");
const logger = require("./logger");

const handleSubscriptionMessages = async ({
  isSubscribingMap,
  chatId,
  msg,
  hour,
  minute,
  bot,
  userData,
}) => {
  if (isSubscribingMap.get(chatId) === false) {
    await bot.sendMessage(chatId, "Thanks for choosing the unsub time!");
    try {
      await deleteSubscription(msg, hour, minute);
      bot.sendMessage(
        msg.chat.id,
        `You have unsubscribed from weather daily report at ${hour}:${minute}`,
      );
    } catch (err) {
      handleDeleteError(err, bot, chatId);
    }
  } else {
    await bot.sendMessage(chatId, "Thanks for sending the sub time!");
    try {
      await addCronJob(chatId, bot, hour, minute, userData.coordinates);
      await addSubscription(msg, hour, minute, userData);
      bot.sendMessage(
        msg.chat.id,
        `You have subscribed on weather daily report at ${hour}:${minute}`,
      );
    } catch (err) {
      handleAddError(err, bot, chatId);
      logger.error(err);
    }
  }
};

module.exports = handleSubscriptionMessages;
