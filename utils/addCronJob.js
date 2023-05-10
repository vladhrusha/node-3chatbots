const logger = require("./logger");
const onSendWeatherReport = require("./onSendWeatherReport");
const CronJob = require("cron").CronJob;
require("dotenv").config();
const TZ = process.env.TZ;
const Subscription = require("../db/subscriptionSchema");
// eslint-disable-next-line
const mongose = require("../db/conn");

const addCronJob = async (msg, bot, hour, minute, userData, subsCollection) => {
  //   Subscription.find().then((subs) => logger.info(subs));

  if (hour !== undefined && minute !== undefined) {
    const subscription = new Subscription({
      userId: msg.from.id,
      userName: msg.from.username,
      hour,
      minute,
    });
    try {
      subscription.coordinates = {
        lat: userData.coordinates.lat,
        lon: userData.coordinates.lon,
      };
    } catch (err) {
      logger.error(err);
    }
    const job = new CronJob(
      `${minute} ${hour} * * *`,
      () => onSendWeatherReport(msg, userData, bot),
      null,
      true,
      TZ,
    );
    if (Object.keys(subscription.toJSON()).length !== 0) {
      try {
        await subscription.save();
        await job.start();
        bot.sendMessage(
          msg.chat.id,
          `You have subscribed on weather daily report at ${subscription.hour}:${subscription.minute}`,
        );
      } catch (err) {
        logger.error(err);
      }
      Object.keys(subscription).forEach((key) => delete subscription[key]);
    }
  }
};
module.exports = addCronJob;
