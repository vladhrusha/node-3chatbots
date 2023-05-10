const logger = require("./logger");
const onSendWeatherReport = require("./onSendWeatherReport");
const CronJob = require("cron").CronJob;
require("dotenv").config();
const TZ = process.env.TZ;

const addCronJob = async (msg, bot, hour, minute, userData, subsCollection) => {
  if (hour && minute) {
    const subscription = {
      userId: msg.from.id,
      userName: msg.from.username,
      hour,
      minute,
    };
    if (userData.coordinates) subscription.coordinates = userData.coordinates;
    const job = new CronJob(
      `${minute} ${hour} * * *`,
      () => onSendWeatherReport(msg, userData, bot),
      null,
      true,
      TZ,
    );
    logger.info(subscription);
    if (Object.keys(subscription).length !== 0) {
      await subsCollection.insertOne(subscription);
      await job.start();
      bot.sendMessage(
        msg.chat.id,
        `You have subscribed on weather daily report at ${subscription.hour}:${subscription.minute}`,
      );
      Object.keys(subscription).forEach((key) => delete subscription[key]);
      hour = undefined;
      minute = undefined;
    }
  }
};
module.exports = addCronJob;
